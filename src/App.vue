<template>
  <v-snackbar :model-value="currentMessage.visible" @update:model-value="hideMessage(currentMessage.id)"
    :color="currentMessage.type" class="top-snackbar" rounded>
    <div class="d-flex align-center justify-space-between w-100">
      <span>{{ $t(currentMessage.message) }}</span>
      <v-btn icon="mdi-close" variant="text" @click="hideMessage(currentMessage.id)" class="ml-4"></v-btn>
    </div>
  </v-snackbar>
  <v-app id="app">
    <v-container fluid class="py-0 px-0 app-container">
      <router-view></router-view>
    </v-container>
    <v-overlay :model-value="isLoading" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    const messages = computed(() => store.getters['notificator/messages']);
    const isLoading = computed(() => store.state.isLoading);

    const currentMessage = computed(() => {
      const lastMessage = messages.value[messages.value.length - 1];
      return lastMessage || { id: '', message: '', type: 'info', visible: false };
    });

    const hideMessage = (id: string) => {
      store.dispatch('notificator/remove', id);
    };

    onMounted(() => {
      store.dispatch('contactInfo/loadContactInfo').catch(() => {
      });
    });

    return {
      currentMessage,
      hideMessage,
      isLoading
    };
  },
});
</script>

<style lang="scss">
@import "./scss/layout.scss";

.top-snackbar {
  top: 60px !important;
  bottom: auto !important;

  .v-snackbar__wrapper {
    min-width: 300px;
    max-width: 600px;
  }

  .v-snackbar__content {
    padding: 12px 16px !important;
  }

  .v-btn--icon {
    width: 36px;
    height: 36px;
    color: currentColor;
  }
}

.v-overlay {
  z-index: 500;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .app-container {
    flex: 1;
    padding: 0 !important;
    margin: 0 !important;
    position: relative;
  }
}

.v-navigation-drawer {
  z-index: 100;
}
</style>