<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("insights-dashboard") }}</h2>
        <p>{{ $t("insights-subtitle") }}</p>
      </template>
      <template #actions>&nbsp;</template>
    </Heading>

    <v-container v-if="!isLoading" class="mt-3">
      <!-- Summary Stats (Admin only) -->
      <v-row v-if="summaryStats" class="mb-4">
        <v-col cols="12">
          <h3 class="mb-4">{{ $t("summary-stats") }}</h3>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <big-chip type="primary" :number="summaryStats.totalMotorcycles" 
            :description="'<strong>' + $t('total-motorcycles') + '</strong>'" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <big-chip type="success" :number="summaryStats.activeMotorcycles" 
            :description="'<strong>' + $t('active-motorcycles') + '</strong>'" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <big-chip type="warning" :number="summaryStats.totalBrands" 
            :description="'<strong>' + $t('total-brands') + '</strong>'" />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <big-chip type="danger" :number="summaryStats.totalAgencies" 
            :description="'<strong>' + $t('total-agencies') + '</strong>'" />
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4">{{ $t("loading") }}</p>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Heading from "@/views/components/Heading.vue";
import BigChip from "@/views/components/BigChip.vue";
import motorcyclesService from '@/services/motorcyclesService';
import { MotorcycleStatsResponse, SearchStatsResponse } from '@/models/motorcycle.model';
import Roles from "@/constants/Roles";

export default {
  components: {
    Heading,
    BigChip,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoading = ref(true);
    const summaryStats = ref<MotorcycleStatsResponse | null>(null);

    const currentUser = computed(() => store.getters["auth/currentUser"]);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);

    onMounted(async () => {
      try {
        isLoading.value = true;
        // Load summary stats (admin only)
        if (isAdmin.value) {
          summaryStats.value = await motorcyclesService.getStats();
        }
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      isLoading,
      summaryStats,
      isAdmin,
    };
  },
};
</script>

<style scoped>
</style>
