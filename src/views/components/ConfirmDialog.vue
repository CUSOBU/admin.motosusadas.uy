<template>
  <v-dialog v-model="dialog" :width="width">
    <template #activator="{ props }">
      <div v-bind="props" @click="dialog = true">
        <slot name="activator" />
      </div>
    </template>

    <v-card color="white">
      <v-card-title class="text-h5">
        <slot name="title">{{ $t("confirm") }}</slot>
        <v-btn icon text="true" elevation="0" class="clear-button" @click="discard">
          <v-icon max-width="20px">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text :class="hideActions ? 'py-0 px-0' : ''">
        <slot>
          {{ $t("this-action-requires-confirmation") }}
        </slot>
      </v-card-text>
      <v-card-actions v-if="!hideActions">
        <slot name="actions">
          <v-row>
            <v-col>
              <v-btn block elevation="0"  variant="outlined" color="red" @click="discard">
                {{ $t("discard") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn block elevation="0" color="primary" variant="flat" @click="confirm">
                {{ $t("confirm") }}
              </v-btn>
            </v-col>
          </v-row>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, onMounted } from 'vue';

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 500,
    },
  },
  emits: ['update:modelValue', 'confirmed', 'discarded'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const dialog = ref(false);

    watch(modelValue, (value) => {
      dialog.value = value;
    });

    watch(dialog, (value) => {
      if (!value) {
        emit('update:modelValue', false);
      }
    });

    const discard = () => {
      emit('discarded');
      dialog.value = false;
    };

    const confirm = () => {
      emit('confirmed');
      dialog.value = false;
    };

    onMounted(() => {
      if (modelValue.value) {
        dialog.value = true;
      }
    });

    return {
      dialog,
      discard,
      confirm,
    };
  },
});
</script>

<style lang="scss" scoped>
.v-overlay__content {
  max-height: 80vh;
}

.clear-button {
  position: absolute;
  border: 0cap !important;
  top: 17px;
  right: 20px;
  background-color: transparent
}

.v-btn {
  border-radius: 16px;
  height: 56px;
  text-transform: none;
}

.v-btn--text {
  height: 100px;

}

.v-card {
  box-shadow: 0px 40px 80px rgba(0, 0, 0, 0.04);
  border-radius: 24px !important;
  padding: 20px 40px 20px 40px;
  border-color: solid red 1px;
}

.v-card__title {
  color: #000000;
  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  padding-bottom: 20px;
}

.v-card__text {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #1a1a1a;
}
</style>
