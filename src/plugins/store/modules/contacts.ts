import contactService from "@/services/contactService";
import {
  ContactMessage,
  ContactMessageFilterRequest,
} from "@/models/contact-message.model";

type State = {
  contacts: ContactMessage[];
  messages: ContactMessage[];
  currentContact: ContactMessage | null;
  total: number;
  unreadCount: number;
  loading: boolean;
};

const state: State = {
  contacts: [],
  messages: [],
  currentContact: null,
  total: 0,
  unreadCount: 0,
  loading: false,
};

const mutations = {
  setContacts(state: State, contacts: ContactMessage[]) {
    state.contacts = contacts;
    state.messages = contacts;
  },
  setCurrentContact(state: State, contact: ContactMessage | null) {
    state.currentContact = contact;
  },
  setTotal(state: State, total: number) {
    state.total = total;
  },
  setUnreadCount(state: State, count: number) {
    state.unreadCount = count;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  contacts: (state: State) => state.contacts,
  messages: (state: State) => state.messages,
  currentContact: (state: State) => state.currentContact,
  total: (state: State) => state.total,
  unreadCount: (state: State) => state.unreadCount,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadContacts(
    { commit }: { commit: any },
    filters: ContactMessageFilterRequest
  ) {
    try {
      commit("setLoading", true);
      const response = await contactService.getMessages(filters);
      commit("setContacts", response.data);
      commit("setTotal", response.pagination.total);
      return response;
    } catch (error) {
      commit("setContacts", []);
      commit("setTotal", 0);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async loadContact({ commit }: { commit: any }, id: string) {
    try {
      commit("setLoading", true);
      const contact = await contactService.getMessage(id);
      commit("setCurrentContact", contact);
      return contact;
    } catch (error) {
      commit("setCurrentContact", null);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async loadUnreadCount({ commit }: { commit: any }) {
    try {
      const response = await contactService.getUnreadCount();
      commit("setUnreadCount", response.unreadCount);
      return response.unreadCount;
    } catch (error) {
      commit("setUnreadCount", 0);
      throw error;
    }
  },

  async markAsRead(
    { commit, dispatch }: { commit: any; dispatch: any },
    id: string
  ) {
    try {
      const contact = await contactService.markAsRead(id, true);
      commit("setCurrentContact", contact);
      await dispatch("loadUnreadCount");
      return contact;
    } catch (error) {
      throw error;
    }
  },

  async markAsUnread(
    { commit, dispatch }: { commit: any; dispatch: any },
    id: string
  ) {
    try {
      const contact = await contactService.markAsRead(id, false);
      commit("setCurrentContact", contact);
      await dispatch("loadUnreadCount");
      return contact;
    } catch (error) {
      throw error;
    }
  },

  async deleteContact({ dispatch }: { dispatch: any }, id: string) {
    try {
      await contactService.deleteMessage(id);
      await dispatch("loadUnreadCount");
    } catch (error) {
      throw error;
    }
  },

  clearCurrentContact({ commit }: { commit: any }) {
    commit("setCurrentContact", null);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
