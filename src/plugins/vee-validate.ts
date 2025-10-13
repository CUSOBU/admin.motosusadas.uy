import {
  required,
  email,
  min,
  max,
  min_value,
  max_value,
  numeric,
  integer,
  regex,
  image,
  size,
  mimes,
  length,
} from "@vee-validate/rules";
import { Field, Form, ErrorMessage, defineRule, configure } from "vee-validate";
import es from "@vee-validate/i18n/dist/locale/es.json";
import { localize } from "@vee-validate/i18n";
import i18n from "@/plugins/i18n";
import { App } from "vue";

defineRule("email", email);
defineRule("max", max);
defineRule("min", min);
defineRule("numeric", numeric);
defineRule("integer", integer);
defineRule("required", required);
defineRule("min_value", min_value);
defineRule("max_value", max_value);
defineRule("regex", regex);
defineRule("image", image);
defineRule("size", size);
defineRule("mimes", mimes);
defineRule("length", length);

defineRule("url", (value: string) => {
  if (!value) {
    return false;
  }
  return /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
});

defineRule("card_number", (value: string) => {
  if (!value) {
    return false;
  }
  return /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/.test(
    value.replace(/\s/g, "")
  );
});

defineRule("expiration", (value: string) => {
  if (!value) {
    return false;
  }
  return /^[0-9]{1,2}\/[2-9][0-9]{2}$/.test(value);
});

defineRule("json", (value: string) => {
  if (!value) {
    return false;
  }
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
});
localize("es", es);
configure({
  generateMessage: (ctx) => {
    const fieldName = i18n.global.t(`${ctx.field}`).toLowerCase();
    const message = localize("es")({
      ...ctx,
      name: fieldName,
    });

    return message;
  },
  validateOnInput: true,
});


const veeValidatePlugin = {
  install(app: App) {
    app.component("Form", Form);
    app.component("Field", Field);
    app.component("ErrorMessage", ErrorMessage);
  },
};

export default veeValidatePlugin;
