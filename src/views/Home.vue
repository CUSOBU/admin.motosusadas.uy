<template>
  <v-overlay :model-value="loading" class="d-flex align-center justify-center">
    <v-progress-circular indeterminate color="primary" />
  </v-overlay>
  <v-container fluid class="py-0">
    <heading/>
    
    <!-- Search Statistics for Agencies -->
    <v-container v-if="!loading && searchStats" class="mt-5">

      <!-- Big Chips for top stats -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6" md="3" v-if="searchStats.topBrandModels.length">
          <big-chip type="primary" :number="searchStats.topBrandModels[0].searchCount" 
            :description="'Moto más buscada: <strong>' + getBrandModelName(searchStats.topBrandModels[0]) + '</strong>'" />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="searchStats.topTypes.length">
          <big-chip type="info" :number="searchStats.topTypes[0].searchCount" 
            :description="'Tipo más buscado: <strong>' + searchStats.topTypes[0].typeName + '</strong>'" />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="searchStats.topYears.length">
          <big-chip type="success" :number="searchStats.topYears[0].searchCount" 
            :description="'Año más popular: <strong>' + searchStats.topYears[0].year + '</strong>'" />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="searchStats.topLocations.length">
          <big-chip type="warning" :number="searchStats.topLocations[0].searchCount" 
            :description="'Ubicación más popular: <strong>' + searchStats.topLocations[0].locationName + '</strong>'" />
        </v-col>
      </v-row>

      <!-- Top Brand + Models -->
      <v-row v-if="searchStats.topBrandModels.length">
        <v-col cols="12" md="6">
          <v-card elevation="2" class="border-primary">
            <v-card-title class="bg-primary text-white">
              <v-icon class="mr-2">mdi-tag-multiple</v-icon>
              {{ $t("top-brands-models") }}
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table class="border-primary">
                <thead>
                  <tr>
                    <th class="text-center">#</th>
                    <th class="text-left">{{ $t("brand") }} / {{ $t("model") }}</th>
                    <th class="text-center">{{ $t("search-count") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in searchStats.topBrandModels" :key="index" 
                      :class="index % 2 === 0 ? 'bg-grey-lighten-4' : ''">
                    <td class="text-center">
                      <span class="font-weight-bold">{{ index + 1 }}</span>
                    </td>
                    <td class="font-weight-medium">
                      <span class="brand-model-name">{{ getBrandModelName(item) }}</span>
                    </td>
                    <td class="text-center">
                      <v-chip size="small" color="primary">{{ item.searchCount }}</v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="2" class="border-primary">
            <v-card-title class="bg-primary text-white">
              <v-icon class="mr-2">mdi-shape</v-icon>
              {{ $t("top-types") }}
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table class="border-primary">
                <thead>
                  <tr>
                    <th class="text-center">#</th>
                    <th class="text-left">{{ $t("type") }}</th>
                    <th class="text-center">{{ $t("search-count") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in searchStats.topTypes" :key="index"
                      :class="index % 2 === 0 ? 'bg-grey-lighten-4' : ''">
                    <td class="text-center">
                      <span class="font-weight-bold">{{ index + 1 }}</span>
                    </td>
                    <td class="font-weight-medium">
                      <span class="type-name">{{ item.typeName }}</span>
                    </td>
                    <td class="text-center">
                      <v-chip size="small" color="primary">{{ item.searchCount }}</v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Top Locations and Years -->
      <v-row class="mt-4" v-if="searchStats.topLocations.length || searchStats.topYears.length">
        <v-col cols="12" md="6" v-if="searchStats.topLocations.length">
          <v-card elevation="2" class="border-primary">
            <v-card-title class="bg-primary text-white">
              <v-icon class="mr-2">mdi-map-marker</v-icon>
              {{ $t("top-locations") }}
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table class="border-primary">
                <thead>
                  <tr>
                    <th class="text-center">#</th>
                    <th class="text-left">{{ $t("location") }}</th>
                    <th class="text-center">{{ $t("search-count") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in searchStats.topLocations" :key="index"
                      :class="index % 2 === 0 ? 'bg-grey-lighten-4' : ''">
                    <td class="text-center">
                      <span class="font-weight-bold">{{ index + 1 }}</span>
                    </td>
                    <td class="font-weight-medium">
                      <span class="location-name">{{ item.locationName }}</span>
                    </td>
                    <td class="text-center">
                      <v-chip size="small" color="primary">{{ item.searchCount }}</v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" v-if="searchStats.topYears.length">
          <v-card elevation="2" class="border-primary">
            <v-card-title class="bg-primary text-white">
              <v-icon class="mr-2">mdi-calendar</v-icon>
              {{ $t("top-years") }}
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table class="border-primary">
                <thead>
                  <tr>
                    <th class="text-center">#</th>
                    <th class="text-left">{{ $t("year") }}</th>
                    <th class="text-center">{{ $t("search-count") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in searchStats.topYears" :key="index"
                      :class="index % 2 === 0 ? 'bg-grey-lighten-4' : ''">
                    <td class="text-center">
                      <span class="font-weight-bold">{{ index + 1 }}</span>
                    </td>
                    <td class="font-weight-medium">
                      <span class="year-name">{{ item.year }}</span>
                    </td>
                    <td class="text-center">
                      <v-chip size="small" color="primary">{{ item.searchCount }}</v-chip>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Suggestions -->
      <v-row class="mt-4" v-if="searchStats.topBrandModels.length">
        <v-col cols="12">
          <v-card elevation="3" color="orange-lighten-5" class="border-l-4 border-warning">
            <v-card-title class="d-flex align-center">
              <v-icon color="warning" size="large" class="mr-2">mdi-lightbulb-on</v-icon>
              <span class="text-h6">{{ $t("suggestions") }}</span>
            </v-card-title>
            <v-card-text>
              <v-list lines="two" bg-color="transparent">
                <v-list-item v-for="(item, index) in topSuggestions" :key="index" class="mb-2">
                  <template #prepend>
                    <v-avatar color="warning" size="40">
                      <span class="text-h6">{{ index + 1 }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-subtitle-1 font-weight-medium">
                    {{ $t("inventory-suggestion", { item: getBrandModelName(item) }) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.searchCount }} búsquedas registradas
                  </v-list-item-subtitle>
                  <template #append>
                    <v-btn color="primary" variant="elevated" @click="addMotorcycle">
                      <v-icon class="mr-1">mdi-plus</v-icon>
                      {{ $t("new-motorcycle") }}
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import BigChip from "./components/BigChip.vue";
import Heading from "./components/Heading.vue";
import motorcyclesService from '@/services/motorcyclesService';
import { SearchStatsResponse, BrandModelSearchItem } from '@/models/motorcycle.model';

export default {  
  components: {
    Heading,
    BigChip,
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const loading = ref(true);
    const searchStats = ref<SearchStatsResponse | null>(null);

    const topSuggestions = computed(() => {
      if (!searchStats.value || !searchStats.value.topBrandModels.length) return [];
      return searchStats.value.topBrandModels.slice(0, 3);
    });

    const getBrandModelName = (item: BrandModelSearchItem) => {
      if (item.modelName) {
        return `${item.brandName} ${item.modelName}`;
      }
      return item.brandName;
    };

    const addMotorcycle = () => {
      router.push({ name: 'motorcycles-create' });
    };

    onMounted(async () => {
      try {
        loading.value = true;
        searchStats.value = await motorcyclesService.getSearchStats();
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      searchStats,
      topSuggestions,
      getBrandModelName,
      addMotorcycle,
    };
  },
};
</script>

<style scoped>
.border-l-4 {
  border-left: 4px solid;
}

.border-warning {
  border-color: #fb8c00;
}

.bg-blue-darken-2 {
  background-color: #1565c0 !important;
}

.bg-blue-darken-1 {
  background-color: #1976d2 !important;
}

.bg-blue {
  background-color: #2196f3 !important;
}

.bg-blue-lighten-1 {
  background-color: #42a5f5 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.brand-model-name,
.type-name,
.location-name,
.year-name {
  font-weight: 700 !important;
  font-size: 15px;
}

:deep(.v-table tbody tr td) {
  vertical-align: middle !important;
}
</style>
