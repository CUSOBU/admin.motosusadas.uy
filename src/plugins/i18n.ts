import { createI18n } from "vue-i18n";
import { es } from "vuetify/locale";
import esLocale from "@/locales/es.json";

const i18n = createI18n({
  legacy: false,
  locale: process.env.VUE_APP_I18N_LOCALE || "es",
  messages: {
    es: {
      $vuetify: {
        ...es,
        datePicker: {
          title: "Seleccionar fecha",
          header: "Entre la fecha"

        },
      },
      ...esLocale,
    },
  },
});

export default i18n;
