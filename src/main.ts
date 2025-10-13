import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "@mdi/font/css/materialdesignicons.css";
import i18n from "@/plugins/i18n";
import veeValidatePlugin from "@/plugins/vee-validate";
import store from "@/plugins/store/store";

async function initApp() {
  await loadFonts();

  const app = createApp(App)
    .use(router)
    .use(store)
    .use(vuetify)
    .use(i18n)
    .use(veeValidatePlugin);

  app.mount("#app");
}
initApp();
