<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("types") }}</h2>
        <p>{{ $t("types-management") }}</p>
      </template>
      <template #actions>
        <v-btn color="primary" variant="flat" elevation="0" @click.prevent="router.push({ name: 'types-create' })">
          <v-icon>mdi-plus</v-icon>
          <span class="d-none d-sm-inline">{{ $t("new-type") }}</span>
        </v-btn>
      </template>
    </Heading>
    <SplitView class="mt-3">
      <template #auxiliar>
        <v-row>
          <v-col cols="12" class="pb-2">
            <v-text-field class="simple-search-result" variant="outlined" :label="$t('search')"
              prepend-inner-icon="mdi-magnify" clearable v-model="filters.keyword">
            </v-text-field>
          </v-col>
        </v-row>
      </template>
      <types-table :search="filters.keyword" />
    </SplitView>
  </v-container>
</template>

<script lang="ts">
import { reactive } from 'vue';
import Heading from "../components/Heading.vue";
import SplitView from "../components/SplitView.vue";
import TypesTable from "./Table.vue";
import { useRouter } from 'vue-router';

export default {
  components: {
    Heading,
    TypesTable,
    SplitView,
  },
  setup() {
    const router = useRouter();

    const filters = reactive({
      keyword: '',
    });

    return {
      filters,
      router,
    };
  },
};
</script>

<style scoped>
.filter-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.filter-subtitle {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.filter-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.checkbox-col {
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
