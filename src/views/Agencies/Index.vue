<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("agencies") }}</h2>
        <p>{{ $t("agencies-management") }}</p>
      </template>
      <template #actions>
        <v-btn color="primary" variant="flat" elevation="0" @click.prevent="router.push({ name: 'agencies-create' })">
          <v-icon>mdi-plus</v-icon>
          <span class="d-none d-sm-inline">{{ $t("new-agency") }}</span>
        </v-btn>
      </template>
    </Heading>
    <SplitView class="mt-3">
      <template #auxiliar>
        <!-- Mobile: Search in accordion -->
        <div class="d-md-none">
          <v-expansion-panels variant="accordion" v-model="mobileFiltersExpanded">
            <v-expansion-panel>
              <v-expansion-panel-title class="mobile-filters-title">
                <v-icon class="mr-2">mdi-magnify</v-icon>
                <h4>{{ $t("search") }}</h4>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" class="pb-2">
                    <v-text-field class="simple-search-result" variant="outlined" :label="$t('search')"
                      prepend-inner-icon="mdi-magnify" clearable v-model="filters.keyword">
                    </v-text-field>
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
        </div>
      </template>
      <agencies-table :search="filters.keyword" />
    </SplitView>
  </v-container>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import Heading from "../components/Heading.vue";
import SplitView from "../components/SplitView.vue";
import AgenciesTable from "./Table.vue";
import { useRouter } from 'vue-router';

export default {
  components: {
    Heading,
    AgenciesTable,
    SplitView,
  },
  setup() {
    const router = useRouter();
    const mobileFiltersExpanded = ref<number[]>([]);

    const filters = reactive({
      keyword: '',
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

.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2d6283;
}

.filter-subtitle {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #2d6283;
}

.filter-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #F6F9F6;
  border-radius: 12px;
  padding: 12px;
}

.checkbox-col {
  padding-top: 4px;
  padding-bottom: 4px;
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

  :deep(.v-expansion-panel) {
    border-radius: 12px;
  }
}
</style>
