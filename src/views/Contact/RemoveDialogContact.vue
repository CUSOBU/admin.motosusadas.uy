<template>
  <confirm-dialog @confirmed="removeContact" :show="dialog" @update:show="dialog = $event" position="fixed">
    <template #activator="{ props }">
      <v-btn small icon class="ml-2 pl-0 pr-0 fg-red" v-bind="props" v-on:click="dialog = true">
        <v-icon color="red">mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
    <template #title>
      {{ t("contacts-.delete") }}
    </template>
    {{ t("contacts-.delete_question") }}
  </confirm-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from 'vue'
import store from '@/plugins/store/store';
import { useI18n } from 'vue-i18n'
import ConfirmDialog from "../components/ConfirmDialog.vue";

export default defineComponent({
  name: 'RemoveDialogContact',
  components: {
    ConfirmDialog,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const { item } = toRefs(props);
    const dialog = ref(false);

    const removeContact = async () => {
      try {
        await store.dispatch("contacts/deleteContact", item.value.id);
        await store.dispatch("notificator/success", "succeeded_operation");
        emit("removed");
      } catch (error) {
        await store.dispatch("notificator/errorResponse", error);
      }
    };

    return {
      t,
      removeContact,
      dialog,
    };
  },
});
</script>