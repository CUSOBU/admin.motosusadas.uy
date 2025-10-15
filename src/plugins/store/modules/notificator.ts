import i18n from "../../i18n";
import { v4 as uuidv4 } from "uuid";
import router from "@/router";
import { ErrorCode } from "@/Enums/ErrorCodes";

interface Messages {
  id: string;
  message: string;
  type: "error" | "info" | "warning" | "success";
  visible: boolean;
}

interface State {
  messages: Messages[];
}
interface Payload {
  message: string;
  type: "error" | "info" | "warning" | "success";
}

const state: State = {
  messages: [],
};

const getters = {
  messages: (state: State) => state.messages,
};

const mutations = {
  addMessage(state: State, payload: Payload) {
    let message = payload.message ?? "";
    if (message.trim() === "") {
      return;
    }
    state.messages = [];

    const translated = i18n.global.t(message) as string;
    const newMessage = {
      id: uuidv4(),
      message: translated,
      type: payload.type,
      visible: true,
    };
    state.messages.push(newMessage);
  },

  hideMessage(state: State, id: string) {
    const message = state.messages.find((message) => message.id === id);
    if (message) {
      message.visible = false;
    }
  },
  removeMessage(state: State, messageId: string) {
    const index = state.messages.findIndex(
      (message) => message.id === messageId
    );
    if (index !== -1) {
      state.messages.splice(index, 1);
    }
  },
};

const actions = {
  addMessage: ({ commit }: { commit: any }, payload: Payload) => {
    commit("addMessage", payload);
  },
  hideMessage: ({ commit }: { commit: any }, id: string) => {
    commit("hideMessage", id);
  },
  info: ({ commit }: { commit: any }, message: string) => {
    commit("addMessage", { message: message, type: "info" });
  },
  warning: ({ commit }: { commit: any }, message: string) => {
    commit("addMessage", { message: message, type: "warning" });
  },
  success: ({ commit }: { commit: any }, message: string) => {
    commit("addMessage", { message: i18n.global.t(message), type: "success" });
  },
  error: ({ commit }: { commit: any }, message: string) => {
    commit("addMessage", { message: i18n.global.t(message), type: "error" });
  },
  remove: ({ commit }: { commit: any }, index: number) => {
    commit("removeMessage", index);
  },
  errorResponse: async (
    { commit, dispatch }: { commit: any; dispatch: any },
    error: any
  ) => {
    try {
      console.log("Error recibido:", error);
      // Normalize error shape from REST-style APIs
      const restCode =
        error?.data?.code || error?.data?.error || error?.code || error?.status;
      const errorCode = restCode || "INTERNAL_ERROR";

      console.log("Código de error:", errorCode);

      const errorMessage = getErrorMessage(errorCode);

      if (
        errorCode === ErrorCode.AUTH_FAILED ||
        errorCode === ErrorCode.INVALID_CREDENTIALS ||
        errorCode === ErrorCode.EMAIL_NOT_VERIFIED ||
        errorCode === ErrorCode.EMAIL_VERIFICATION_EXPIRED
      ) {
        await dispatch("auth/logout");
        router.push("/login");
      }

      await commit("addMessage", {
        message: errorMessage,
        type: "error",
      });
    } catch (e) {
      await commit("addMessage", {
        message: "errors.unexpected",
        type: "error",
      });
    }
  },
};

function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    [ErrorCode.USER_EMAIL_OR_PHONE_EXISTS]: "errors.user-exists",
    [ErrorCode.USER_EMAIL_OR_PHONE_EXISTS_DELETED]:
      "errors.user-exists-deleted",
    [ErrorCode.USER_CREATION_FAILED]: "errors.user-creation-failed",
    [ErrorCode.USER_VERIFICATION_FAILED]: "errors.user-verification-failed",
    [ErrorCode.AUTH_FAILED]: "errors.auth-failed",
    [ErrorCode.INVALID_CREDENTIALS]: "errors.invalid-credentials",
    [ErrorCode.VALIDATION_ERROR]: "errors.validation",
    [ErrorCode.SMS_NOTIFICATION_FAILED]: "errors.sms-notification-failed",
    [ErrorCode.CATEGORY_EXISTS]: "errors.category-exists",
    [ErrorCode.CATEGORY_CREATION_FAILED]: "errors.category-creation-failed",
    [ErrorCode.CATEGORY_NOT_FOUND]: "errors.category-not-found",
    [ErrorCode.SUBCATEGORY_EXISTS]: "errors.subcategory-exists",
    [ErrorCode.SUBCATEGORY_NOT_FOUND]: "errors.subcategory-not-found",
    [ErrorCode.SUBCATEGORY_CREATION_FAILED]:
      "errors.subcategory-creation-failed",
    [ErrorCode.UUID_FORMAT_ERROR]: "errors.uuid-format-error",
    [ErrorCode.PRODUCT_NOT_FOUND]: "errors.product-not-found",
    [ErrorCode.PRODUCT_UPDATE_FAILED]: "errors.product-update-failed",
    [ErrorCode.PRODUCT_SYNC_FAILED]: "errors.product-sync-failed",
    [ErrorCode.PRODUCT_CLASSIFICATION_ERROR]:
      "errors.product-classification-error",
    [ErrorCode.CREATION_FAILED]: "errors.creation-failed",
    [ErrorCode.USER_INACTIVE]: "errors.user-inactive",
    [ErrorCode.CONTACT_NOT_FOUND]: "errors.contact-not-found",
    [ErrorCode.CONTACT_CREATION_FAILED]: "errors.contact-creation-failed",
    [ErrorCode.CONTACT_UPDATE_FAILED]: "errors.contact-update-failed",
    [ErrorCode.CONTACT_DELETE_FAILED]: "errors.contact-delete-failed",
    [ErrorCode.USER_NOT_FOUND]: "errors.user-not-found",
    [ErrorCode.USER_UPDATE_FAILED]: "errors.user-update-failed",
    [ErrorCode.USER_DELETE_FAILED]: "errors.user-delete-failed",
    [ErrorCode.INTERNAL_ERROR]: "errors.internal-error",
    [ErrorCode.EMAIL_NOT_VERIFIED]: "errors.email-not-verified",
    [ErrorCode.EMAIL_VERIFICATION_EXPIRED]: "errors.email-verification-expired",
    [ErrorCode.VALIDATION_NOT_DESACTIVE_ERROR]: "errors.cannot-deactivate-user",
    [ErrorCode.ACCESS_DENIED]: "errors.access-denied",
    [ErrorCode.ALREADY_EXISTS]: "errors.already-exists",
  };

  return errorMessages[errorCode] || "errors.unexpected";
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
