<template>
  <div class="heading-container">
    <v-row class="mt-5">
      <v-col cols="8" sm="4" class="heading-title">
        <slot name="title">
          <h2>{{ $t("dashboard") }}</h2>
          <p>{{ $t("dashboard_welcome") }}</p>
        </slot>
      </v-col>
      <v-col cols="4" sm="8" class="heading-actions">
        <slot name="actions"> </slot>
        <v-btn v-if="!lgAndUp" text dark class="action-btn" @click="toggleDrawer">
          <v-icon color="#2d6283">mdi-menu</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { useDisplay } from 'vuetify'

export default {
  setup() {
    const { lgAndUp } = useDisplay()
    const store = useStore();

    const toggleDrawer = () => {
      store.commit("toggleDrawer");
    };

    return {
      lgAndUp,
      toggleDrawer,
    }
  },
};
</script>

<style lang="scss" scoped>
.heading-container {
  width: 100%;
  padding: 0;
  margin: 0;
}

.heading-title {
  padding-left: 0 !important;
  max-width: 26% !important;
}

.v-row {
  margin: 0 !important;
}

.v-col {
  padding: 0 !important;
}

.heading-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.action-btn {
  margin-left: 8px !important;
}

@media (max-width: 600px) {
  .heading-title {
    max-width: 60% !important;
  }

  .heading-actions {
    display: flex;
    justify-content: flex-end;
    min-width: 40% !important;
  }
}
</style>
