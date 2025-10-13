import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import i18n from "./i18n";
import { useI18n } from "vue-i18n";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#457b9d",
          secondary: "#7CC7CA",
          accent: "#E63946",
          info: "#00CAE3",
          success: "40A578",
          warning: "#EACB00",
          error: "#E63946",
        },
        dark: false,
      },
      dark: {
        colors: {
          primary: "#457b9d",
          secondary: "#7CC7CA",
          accent: "#E63946",
          info: "#00CAE3",
          success: "#0AC229",
          warning: "#EACB00",
          error: "#E63946",
        },
        dark: true,
      },
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
    locale: "es", 
  },
});

export default vuetify;
