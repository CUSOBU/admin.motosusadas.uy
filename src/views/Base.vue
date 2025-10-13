<template>
  <v-container fluid class="px-0 py-0">
    <app-drawer :modelValue="drawerOpen" @update:modelValue="toggleDrawer" />
    <div :class="['main-content', {'content-with-drawer': lgAndUp && drawerOpen, 'content-without-drawer': lgAndUp && !drawerOpen, 'mobile-content': !lgAndUp}]">
      <div class="px-5">
        <router-view></router-view>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted, computed } from "vue";
import { useDisplay } from "vuetify";
import AppDrawer from "./components/Drawer.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    AppDrawer,
  },

  setup() {
    const store = useStore();
    const { lgAndUp } = useDisplay();
    const drawerOpen = computed(() => store.state.openDrawer);

    const toggleDrawer = () => {
      store.commit("toggleDrawer");
    };
    onMounted(() => {
      if (lgAndUp.value && !drawerOpen.value) {
        store.commit("setDrawerOpen", true);
      }

      if (!lgAndUp.value && drawerOpen.value) {
        store.commit("setDrawerOpen", false);
      }
    });
    watch(lgAndUp, (newValue) => {
      if (newValue && !drawerOpen.value) {
        store.commit("setDrawerOpen", true);
      }
      
      if (!newValue && drawerOpen.value) {
        store.commit("setDrawerOpen", false);
      }
    });

    return {
      lgAndUp,
      toggleDrawer,
      drawerOpen
    };
  }
});
</script>

<style lang="scss" scoped>

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.main-content {
  flex: 1;
  transition: margin-left 0.3s ease, width 0.3s ease;
  overflow-y: auto;
  height: 100vh;
  width: 100%;
}

.content-with-drawer {
  margin-left: 320px;
  width: calc(100% - 320px);
}

.content-without-drawer {
  margin-left: 0;
  width: 100%;
}

.mobile-content {
  margin-left: 0;
  width: 100%;
}

.px-5 {
  padding: 5px;
}
</style>
