<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("seller-vehicles") }}</h2>
        <p>{{ $t("seller-vehicles-management") }}</p>
      </template>
    </Heading>
    <SplitView class="mt-3">
      <template #auxiliar>
        <!-- Mobile: All filters in one accordion -->
        <div class="d-md-none">
          <v-expansion-panels variant="accordion" v-model="mobileFiltersExpanded">
            <v-expansion-panel>
              <v-expansion-panel-title class="mobile-filters-title">
                <v-icon class="mr-2">mdi-filter-variant</v-icon>
                <h4>{{ $t("filter-by") }}</h4>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" class="pb-2">
                    <v-text-field class="simple-search-result" variant="outlined" :label="$t('search')"
                      prepend-inner-icon="mdi-magnify" clearable v-model="filters.search">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mb-3">
                  <v-col cols="12">
                    <v-btn color="primary" variant="flat" elevation="0" @click="resetFilters" block>
                      <v-icon>mdi-refresh</v-icon>
                      {{ $t("reset-filters") }}
                    </v-btn>
                  </v-col>
                </v-row>

                <v-expansion-panels variant="accordion" class="inner-panels">
                  <!-- Status Filter (Admin only) -->
                  <v-expansion-panel v-if="isAdmin">
                    <v-expansion-panel-title class="filter-panel-title">
                      <h5 class="filter-subtitle">{{ $t("vehicle-status") }}</h5>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="filter-panel-content">
                      <v-row class="filter-section">
                        <v-col cols="12" class="py-0">
                          <v-select
                            v-model="filters.status"
                            :items="statusOptions"
                            item-title="text"
                            item-value="value"
                            variant="outlined"
                            :label="$t('filter-by-status')"
                            clearable
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- Brand Filter -->
                  <v-expansion-panel>
                    <v-expansion-panel-title class="filter-panel-title">
                      <h5 class="filter-subtitle">{{ $t("brand") }}</h5>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="filter-panel-content">
                      <v-row class="filter-section">
                        <v-col cols="12" class="py-0">
                          <v-select
                            v-model="filters.brandId"
                            :items="brands"
                            item-title="name"
                            item-value="id"
                            variant="outlined"
                            :label="$t('brand')"
                            clearable
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- Model Filter -->
                  <v-expansion-panel v-if="filters.brandId">
                    <v-expansion-panel-title class="filter-panel-title">
                      <h5 class="filter-subtitle">{{ $t("model") }}</h5>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="filter-panel-content">
                      <v-row class="filter-section">
                        <v-col cols="12" class="py-0">
                          <v-select
                            v-model="filters.modelId"
                            :items="filteredModels"
                            item-title="name"
                            item-value="id"
                            variant="outlined"
                            :label="$t('model')"
                            clearable
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- Type Filter -->
                  <v-expansion-panel>
                    <v-expansion-panel-title class="filter-panel-title">
                      <h5 class="filter-subtitle">{{ $t("type") }}</h5>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="filter-panel-content">
                      <v-row class="filter-section">
                        <v-col cols="12" class="py-0">
                          <v-select
                            v-model="filters.typeId"
                            :items="types"
                            item-title="name"
                            item-value="id"
                            variant="outlined"
                            :label="$t('type')"
                            clearable
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- Location Filter -->
                  <v-expansion-panel>
                    <v-expansion-panel-title class="filter-panel-title">
                      <h5 class="filter-subtitle">{{ $t("location") }}</h5>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="filter-panel-content">
                      <v-row class="filter-section">
                        <v-col cols="12" class="py-0">
                          <v-select
                            v-model="filters.locationId"
                            :items="locations"
                            item-title="name"
                            item-value="id"
                            variant="outlined"
                            :label="$t('location')"
                            clearable
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- Price Range Filter -->
                  <v-expansion-panel>
                    <v-expansion-panel-title class="filter-panel-title">
                      <h5 class="filter-subtitle">{{ $t("price-range") }}</h5>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="filter-panel-content">
                      <v-row class="filter-section">
                        <v-col cols="12" class="py-0">
                          <v-text-field
                            v-model="filters.minPrice"
                            variant="outlined"
                            :label="$t('min-price')"
                            type="number"
                            clearable
                            @update:modelValue="handleNumberInput('minPrice', $event)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="py-0">
                          <v-text-field
                            v-model="filters.maxPrice"
                            variant="outlined"
                            :label="$t('max-price')"
                            type="number"
                            clearable
                            @update:modelValue="handleNumberInput('maxPrice', $event)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- Year Range Filter -->
                  <v-expansion-panel>
                    <v-expansion-panel-title class="filter-panel-title">
                      <h5 class="filter-subtitle">{{ $t("year-range") }}</h5>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="filter-panel-content">
                      <v-row class="filter-section">
                        <v-col cols="12" class="py-0">
                          <v-text-field
                            v-model="filters.minYear"
                            variant="outlined"
                            :label="$t('min-year')"
                            type="number"
                            clearable
                            @update:modelValue="handleNumberInput('minYear', $event)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="py-0">
                          <v-text-field
                            v-model="filters.maxYear"
                            variant="outlined"
                            :label="$t('max-year')"
                            type="number"
                            clearable
                            @update:modelValue="handleNumberInput('maxYear', $event)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!-- Desktop: Regular Filter Sidebar -->
        <div class="d-none d-md-block">
          <v-row>
            <v-col cols="12" class="pb-2">
              <v-text-field class="simple-search-result" variant="outlined" :label="$t('search')"
                prepend-inner-icon="mdi-magnify" clearable v-model="filters.search">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row class="mb-3">
            <v-col cols="12">
              <v-btn color="primary" variant="flat" elevation="0" @click="resetFilters">
                <v-icon>mdi-refresh</v-icon>
                <span class="d-none d-sm-inline">{{ $t("reset-filters") }}</span>
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="pb-2 pt-2">
              <h4 class="filter-title">{{ $t("filter-by") }}</h4>
            </v-col>
          </v-row>

          <v-expansion-panels variant="accordion">
            <!-- Status Filter (Admin only) -->
            <v-expansion-panel v-if="isAdmin">
              <v-expansion-panel-title class="filter-panel-title">
                <h5 class="filter-subtitle">{{ $t("vehicle-status") }}</h5>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="filter-panel-content">
                <v-row class="filter-section">
                  <v-col cols="12" class="py-0">
                    <v-select
                      v-model="filters.status"
                      :items="statusOptions"
                      item-title="text"
                      item-value="value"
                      variant="outlined"
                      :label="$t('filter-by-status')"
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Brand Filter -->
            <v-expansion-panel>
              <v-expansion-panel-title class="filter-panel-title">
                <h5 class="filter-subtitle">{{ $t("brand") }}</h5>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="filter-panel-content">
                <v-row class="filter-section">
                  <v-col cols="12" class="py-0">
                    <v-select
                      v-model="filters.brandId"
                      :items="brands"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      :label="$t('brand')"
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Model Filter -->
            <v-expansion-panel v-if="filters.brandId">
              <v-expansion-panel-title class="filter-panel-title">
                <h5 class="filter-subtitle">{{ $t("model") }}</h5>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="filter-panel-content">
                <v-row class="filter-section">
                  <v-col cols="12" class="py-0">
                    <v-select
                      v-model="filters.modelId"
                      :items="filteredModels"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      :label="$t('model')"
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Type Filter -->
            <v-expansion-panel>
              <v-expansion-panel-title class="filter-panel-title">
                <h5 class="filter-subtitle">{{ $t("type") }}</h5>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="filter-panel-content">
                <v-row class="filter-section">
                  <v-col cols="12" class="py-0">
                    <v-select
                      v-model="filters.typeId"
                      :items="types"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      :label="$t('type')"
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Location Filter -->
            <v-expansion-panel>
              <v-expansion-panel-title class="filter-panel-title">
                <h5 class="filter-subtitle">{{ $t("location") }}</h5>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="filter-panel-content">
                <v-row class="filter-section">
                  <v-col cols="12" class="py-0">
                    <v-select
                      v-model="filters.locationId"
                      :items="locations"
                      item-title="name"
                      item-value="id"
                      variant="outlined"
                      :label="$t('location')"
                      clearable
                    ></v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Price Range Filter -->
            <v-expansion-panel>
              <v-expansion-panel-title class="filter-panel-title">
                <h5 class="filter-subtitle">{{ $t("price-range") }}</h5>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="filter-panel-content">
                <v-row class="filter-section">
                  <v-col cols="12" class="py-0">
                    <v-text-field
                      v-model="filters.minPrice"
                      variant="outlined"
                      :label="$t('min-price')"
                      type="number"
                      clearable
                      @update:modelValue="handleNumberInput('minPrice', $event)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-text-field
                      v-model="filters.maxPrice"
                      variant="outlined"
                      :label="$t('max-price')"
                      type="number"
                      clearable
                      @update:modelValue="handleNumberInput('maxPrice', $event)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Year Range Filter -->
            <v-expansion-panel>
              <v-expansion-panel-title class="filter-panel-title">
                <h5 class="filter-subtitle">{{ $t("year-range") }}</h5>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="filter-panel-content">
                <v-row class="filter-section">
                  <v-col cols="12" class="py-0">
                    <v-text-field
                      v-model="filters.minYear"
                      variant="outlined"
                      :label="$t('min-year')"
                      type="number"
                      clearable
                      @update:modelValue="handleNumberInput('minYear', $event)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <v-text-field
                      v-model="filters.maxYear"
                      variant="outlined"
                      :label="$t('max-year')"
                      type="number"
                      clearable
                      @update:modelValue="handleNumberInput('maxYear', $event)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </template>
      <seller-vehicles-table
        :search="filters.search"
        :status="filters.status"
        :brand-id="filters.brandId"
        :model-id="filters.modelId"
        :type-id="filters.typeId"
        :location-id="filters.locationId"
        :min-price="filters.minPrice"
        :max-price="filters.maxPrice"
        :min-year="filters.minYear"
        :max-year="filters.maxYear"
        :min-kms="filters.minKms"
        :max-kms="filters.maxKms"
        :min-cubic-capacity="filters.minCubicCapacity"
        :max-cubic-capacity="filters.maxCubicCapacity"
      />
    </SplitView>
  </v-container>
</template>

<script lang="ts">
import { reactive, computed, onMounted, watch, ref } from 'vue';
import Heading from "../components/Heading.vue";
import SplitView from "../components/SplitView.vue";
import SellerVehiclesTable from "./Table.vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Roles from "@/constants/Roles";
import { SellerVehicleStatus } from "@/models/seller-vehicle.model";
import i18n from "@/plugins/i18n";

export default {
  components: {
    Heading,
    SellerVehiclesTable,
    SplitView,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const currentUser = computed(() => store.getters["auth/currentUser"]);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);
    const brands = computed(() => store.state.brands.brands || []);
    const models = computed(() => store.state.models.models || []);
    const types = computed(() => store.state.types.types || []);
    const locations = computed(() => store.state.locations.locations || []);

    const mobileFiltersExpanded = ref<number[]>([]);

    const statusOptions = ref([
      { value: SellerVehicleStatus.Pending, text: i18n.global.t('status-pending') },
      { value: SellerVehicleStatus.Approved, text: i18n.global.t('status-approved') },
      { value: SellerVehicleStatus.Rejected, text: i18n.global.t('status-rejected') },
      { value: SellerVehicleStatus.Contacted, text: i18n.global.t('status-contacted') },
    ]);

    const filters = reactive({
      search: '',
      status: null as SellerVehicleStatus | null,
      brandId: null as string | null,
      modelId: null as string | null,
      typeId: null as string | null,
      locationId: null as string | null,
      minPrice: null as number | null,
      maxPrice: null as number | null,
      minYear: null as number | null,
      maxYear: null as number | null,
      minKms: null as number | null,
      maxKms: null as number | null,
      minCubicCapacity: null as number | null,
      maxCubicCapacity: null as number | null,
    });

    const filteredModels = computed(() => {
      if (!filters.brandId) return [];
      return models.value.filter((m: any) => m.brandId === filters.brandId);
    });

    watch(() => filters.brandId, (newVal) => {
      if (!newVal) {
        filters.modelId = null;
      }
    });

    onMounted(async () => {
      try {
        await store.dispatch('brands/loadBrands', {});
        await store.dispatch('models/loadModels', {});
        await store.dispatch('types/loadTypes', {});
        await store.dispatch('locations/loadLocations', {});
      } catch (error) {
        console.error('Error loading filters data:', error);
      }
    });

    const resetFilters = () => {
      filters.search = '';
      filters.status = null;
      filters.brandId = null;
      filters.modelId = null;
      filters.typeId = null;
      filters.locationId = null;
      filters.minPrice = null;
      filters.maxPrice = null;
      filters.minYear = null;
      filters.maxYear = null;
      filters.minKms = null;
      filters.maxKms = null;
      filters.minCubicCapacity = null;
      filters.maxCubicCapacity = null;
    };

    const handleNumberInput = (field: string, value: any) => {
      if (value === '' || value === null || value === undefined) {
        (filters as any)[field] = null;
      } else {
        const num = Number(value);
        (filters as any)[field] = isNaN(num) ? null : num;
      }
    };

    return {
      router,
      filters,
      brands,
      models,
      types,
      locations,
      filteredModels,
      resetFilters,
      handleNumberInput,
      isAdmin,
      statusOptions,
      mobileFiltersExpanded,
    };
  },
};
</script>

<style scoped>
.mobile-filters-title {
  background-color: #f6f9f6;
  color: #2d6283;
  font-weight: 600;
  border-radius: 12px !important;
}

.mobile-filters-title :deep(.v-expansion-panel-title__icon) {
  color: #2d6283 !important;
}

.inner-panels {
  margin-top: 8px;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d6283;
}

.filter-subtitle {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0;
  color: #2d6283;
}

.filter-section {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.checkbox-col {
  padding-top: 2px;
  padding-bottom: 2px;
}

:deep(.v-expansion-panel) {
  background-color: #f6f9f6;
  margin-bottom: 8px;
  border-radius: 12px;
}

:deep(.v-expansion-panel-title) {
  background-color: #f6f9f6;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 12px;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 16px;
  background-color: #f6f9f6;
}

:deep(.v-expansion-panels) {
  gap: 0;
}

@media (max-width: 959px) {
  :deep(.v-data-table) {
    min-height: 60vh;
  }
  
  :deep(.v-table__wrapper) {
    min-height: 60vh;
    max-height: 70vh;
    overflow-y: auto;
  }
}
</style>
