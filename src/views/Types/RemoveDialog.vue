<template>
  <confirm-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" @confirmed="remove">
    <template #title>
      {{ $t("delete-location") }}
    </template>
    {{ $t("delete-location-confirmation", { name: item ? item.name : '-' }) }}
  </confirm-dialog>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import ConfirmDialog from "../components/ConfirmDialog.vue";

export default {
  components: {
    ConfirmDialog
  },
  props: {
    item: {
      type: Object,
      required: false,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['removed', 'update:show'],
  setup(props: any, { emit }: any) {
    const store = useStore();

    const remove = async () => {
      try {
        await store.dispatch('types/deleteType', props.item.id);
        await store.dispatch('notificator/success', 'location-deleted-success');
        emit('removed');
        emit('update:show', false);
      } catch (error) {
        await store.dispatch('notificator/errorResponse', error);
      }
    };

    return {
      remove
    };
  }
};
</script>
