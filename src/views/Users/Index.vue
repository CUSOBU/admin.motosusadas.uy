<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("users") }}</h2>
        <p>{{ $t("users-management") }}</p>
      </template>
      <template #actions>
        <v-btn color="primary" variant="flat" elevation="0" @click.prevent="router.push({ name: 'users-create' })">
          <v-icon>mdi-plus</v-icon>
          <span class="d-none d-sm-inline">{{ $t("new-user") }}</span>
        </v-btn>
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
                      prepend-inner-icon="mdi-magnify" clearable v-model="filters.keyword">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row class="filter-section">
                  <v-col cols="12" class="pb-1">
                    <h5 class="filter-subtitle">{{ $t("status") }}</h5>
                  </v-col>
                  <v-col cols="6" class="checkbox-col">
                    <v-checkbox v-model="filters.active" :value="null" :label="$t('all')" hide-details density="compact" />
                  </v-col>
                  <v-col cols="6" class="checkbox-col">
                    <v-checkbox v-model="filters.active" :value="true" :label="$t('active')" hide-details density="compact" />
                  </v-col>
                  <v-col cols="6" class="checkbox-col">
                    <v-checkbox v-model="filters.active" :value="false" :label="$t('inactive')" hide-details
                      density="compact" />
                  </v-col>
                </v-row>

                <v-row class="filter-section">
                  <v-col cols="12" class="pb-1 pt-2">
                    <h5 class="filter-subtitle">{{ $t("role") }}</h5>
                  </v-col>
                  <v-col cols="6" class="checkbox-col">
                    <v-checkbox v-model="filters.authLevel" :value="null" :label="$t('all')" hide-details density="compact" />
                  </v-col>
                  <v-col cols="6" class="checkbox-col">
                    <v-checkbox v-model="filters.authLevel" :value="2" :label="$t('roles.admin')" hide-details
                      density="compact" />
                  </v-col>
                  <v-col cols="6" class="checkbox-col">
                    <v-checkbox v-model="filters.authLevel" :value="1" :label="$t('roles.agency')" hide-details
                      density="compact" />
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!-- Desktop: Original layout -->
        <div class="d-none d-md-block">
          <v-row>
            <v-col cols="12" class="pb-2">
              <v-text-field class="simple-search-result" variant="outlined" :label="$t('search')"
                prepend-inner-icon="mdi-magnify" clearable v-model="filters.keyword">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="pb-2 pt-2">
              <h4 class="filter-title">{{ $t("filter-by") }}</h4>
            </v-col>
          </v-row>

          <v-row class="filter-section">
            <v-col cols="12" class="pb-1">
              <h5 class="filter-subtitle">{{ $t("status") }}</h5>
            </v-col>
            <v-col cols="6" class="checkbox-col">
              <v-checkbox v-model="filters.active" :value="null" :label="$t('all')" hide-details density="compact" />
            </v-col>
            <v-col cols="6" class="checkbox-col">
              <v-checkbox v-model="filters.active" :value="true" :label="$t('active')" hide-details density="compact" />
            </v-col>
            <v-col cols="6" class="checkbox-col">
              <v-checkbox v-model="filters.active" :value="false" :label="$t('inactive')" hide-details
                density="compact" />
            </v-col>
          </v-row>

          <v-row class="filter-section">
            <v-col cols="12" class="pb-1 pt-2">
              <h5 class="filter-subtitle">{{ $t("role") }}</h5>
            </v-col>
            <v-col cols="6" class="checkbox-col">
              <v-checkbox v-model="filters.authLevel" :value="null" :label="$t('all')" hide-details density="compact" />
            </v-col>
            <v-col cols="6" class="checkbox-col">
              <v-checkbox v-model="filters.authLevel" :value="2" :label="$t('roles.admin')" hide-details
                density="compact" />
            </v-col>
            <v-col cols="6" class="checkbox-col">
              <v-checkbox v-model="filters.authLevel" :value="1" :label="$t('roles.agency')" hide-details
                density="compact" />
            </v-col>
          </v-row>
        </div>
      </template>
      <users-table :search="filters.keyword" :active="filters.active" :auth-level="filters.authLevel" />
    </SplitView>
  </v-container>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import Heading from "../components/Heading.vue";
import SplitView from "../components/SplitView.vue";
import UsersTable from "./Table.vue";
import { useRouter } from 'vue-router';

export default {
  components: {
    Heading,
    UsersTable,
    SplitView,
  },
  setup() {
    const router = useRouter();
    const mobileFiltersExpanded = ref<number[]>([]);

    const filters = reactive({
      keyword: '',
      active: null as boolean | null,
      authLevel: null as number | null,
    });

    return {
      filters,
      router,
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

.filter-title {
  font-weight: 600;
  color: #2d6283;
}

.filter-subtitle {
  font-weight: 500;
  color: #2d6283;
}

.checkbox-col {
  padding-top: 0;
  padding-bottom: 0;
}

.checkbox-col :deep(.v-label) {
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 0.875rem;
}

.checkbox-col :deep(.v-selection-control) {
  margin-top: -8px;
  margin-bottom: -8px;
}

.filter-section .v-col {
  min-height: 30px;
}

.filter-section {
  margin: 0;
  background-color: #f6f9f6;
  border-radius: 12px;
  padding: 12px;
}

:deep(.v-expansion-panel) {
  background-color: #f6f9f6;
}

:deep(.v-expansion-panel-title) {
  background-color: #f6f9f6;
  border-radius: 12px;
}

:deep(.v-expansion-panel-text__wrapper) {
  background-color: #f6f9f6;
}

:deep(.v-row) {
  margin: 0;
}

:deep(.v-col) {
  padding: 4px 0px;
}

.simple-search-result {
  margin-bottom: 8px;
}

.filter-section + .filter-section {
  margin-top: 16px;
}

/* Altura adicional para la tabla en móviles */
@media (max-width: 959px) {
  :deep(.v-data-table) {
    min-height: 60vh;
  }
  
  :deep(.v-table__wrapper) {
    min-height: 60vh;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  :deep(.v-expansion-panel) {
    border-radius: 12px;
  }
}
</style>
