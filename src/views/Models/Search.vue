<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col class="mt-2">
          <v-text-field dense hide-details v-model="search" variant="outlined" :label="$t('search')" />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <v-list class="v-list-search-result">
            <v-list-item v-for="(item, i) in filteredModels" :key="i" color="primary" @click="selectedItem = i"
              :selected="selectedItem === i">
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.brand?.name || '-' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'SearchModels',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const timeout = ref<number | null>(null);
    const search = ref("");
    const selectedItem = ref<number | null>(null);
    const models = computed(() => store.state.models.models || []);

    const filteredModels = computed(() => {
      if (!search.value) {
        return models.value;
      }
      const q = search.value.toLowerCase();
      return models.value.filter((model: any) =>
        (model.name && model.name.toLowerCase().includes(q)) ||
        (model.brand?.name && model.brand.name.toLowerCase().includes(q))
      );
    });

    watch(search, async () => {
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
      timeout.value = window.setTimeout(
        function () {
          loadItems();
        },
        1000
      );
    });

    watch(selectedItem, async (index) => {
      let routeName = 'models-edit';
      if (router.currentRoute.value.name === 'models-details') {
        routeName = 'models-details';
      }
      if (selectedItem.value !== null && filteredModels.value[selectedItem.value]) {
        router.push({
          name: routeName,
          params: { id: filteredModels.value[selectedItem.value].id }
        });
      }
    });

    const loadItems = async () => {
      try {
        const params = {
          search: search.value || null,
        };
        await store.dispatch('models/loadModels', params);
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    onMounted(async () => {
      await loadItems();
      if (filteredModels.value) {
        const modelIndex = filteredModels.value.findIndex(
          (model: any) => model.id === route.params.id
        );
        if (modelIndex !== -1) {
          selectedItem.value = modelIndex;
        }
      }
    });

    return {
      search,
      filteredModels,
      selectedItem,
    };
  },
};
</script>

<style scoped>
.v-list-search-result {
  max-height: 600px;
  overflow-y: auto;
}
</style>
