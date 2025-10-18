<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("contact-messages") }}</h2>
        <p>{{ $t("contact-messages-management") }}</p>
      </template>
      <template #actions>
        <v-chip color="primary" variant="outlined" v-if="unreadCount > 0">
          <v-icon left>mdi-email</v-icon>
          {{ unreadCount }} {{ $t("unread") }}
        </v-chip>
      </template>
    </Heading>
    <SplitContent class="mt-3">
      <template #auxiliar>
        <!-- Mobile: Filters in accordion -->
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
                      prepend-inner-icon="mdi-magnify" clearable v-model="filters.keyword" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" class="py-0">
                    <h5>{{ $t("status-filter") }}</h5>
                  </v-col>
                  <v-col cols="6" class="pl-0">
                    <v-checkbox v-model="filters.active" :value="null" :label="$t('all')" hide-details />
                  </v-col>
                  <v-col cols="6" class="pl-0">
                    <v-checkbox v-model="filters.active" :value="true" :label="$t('read')" hide-details />
                  </v-col>
                  <v-col cols="6" class="pl-0">
                    <v-checkbox v-model="filters.active" :value="false" :label="$t('unread')" hide-details />
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
                prepend-inner-icon="mdi-magnify" clearable v-model="filters.keyword" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="pb-2 pt-2">
              <h4 class="filter-title">{{ $t("filter-by") }}</h4>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="py-0">
              <h5>{{ $t("status-filter") }}</h5>
            </v-col>
            <v-col cols="6" class="pl-0">
              <v-checkbox v-model="filters.active" :value="null" :label="$t('all')" hide-details />
            </v-col>
            <v-col cols="6" class="pl-0">
              <v-checkbox v-model="filters.active" :value="true" :label="$t('read')" hide-details />
            </v-col>
            <v-col cols="6" class="pl-0">
              <v-checkbox v-model="filters.active" :value="false" :label="$t('unread')" hide-details />
            </v-col>
          </v-row>
        </div>
      </template>
      <contacts-table :search="filters.keyword" :active="filters.active" :type="filters.type" />
    </SplitContent>
  </v-container>
</template>

<script lang="ts">
import { computed, reactive, watch, onMounted, ref } from 'vue';
import Heading from "../components/Heading.vue";
import SplitContent from "../components/SplitView.vue";
import ContactsTable from "./TableContact.vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  components: {
    Heading,
    ContactsTable,
    SplitContent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const unreadCount = computed(() => store.state.contacts.unreadCount);
    const mobileFiltersExpanded = ref<number[]>([]);
    
    const filters = reactive({
      keyword: '',
      active: null as boolean | null,
      type: null as 'GENERAL' | 'DELETION_REQUEST' | null,
    });

    onMounted(async () => {
      // Load initial unread count
      try {
        await store.dispatch('contacts/loadUnreadCount');
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    });

    return {
      filters,
      router,
      unreadCount,
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
  border-radius: 12px;
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
  margin-bottom: 8px;
  color: #2d6283;
}

:deep(.pl-0 .v-input__control) {
  margin-top: -20px !important;
  margin-bottom: -30px !important;
  margin-left: 0 !important;
}

:deep(.v-label) {
  color: black !important;
}

.simple-search-result {
  margin-bottom: 1rem;
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