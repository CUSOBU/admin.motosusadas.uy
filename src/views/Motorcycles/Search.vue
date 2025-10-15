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
            <v-list-item v-for="(item, i) in filteredMotorcycles" :key="i" color="primary" @click="selectedItem = i"
              :selected="selectedItem === i">
              <v-list-item-title>
                {{ item.brandName }} {{ item.modelName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="text--primary">{{ item.name }}</span> - {{ item.year }}
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
  name: 'SearchMotorcycles',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const timeout = ref<number | null>(null);
    const search = ref("");
    const selectedItem = ref<number | null>(null);
    const motorcycles = computed(() => store.state.motorcycles.motorcycles || []);

    const filteredMotorcycles = computed(() => {
      if (!search.value) {
        return motorcycles.value;
      }
      const q = search.value.toLowerCase();
      return motorcycles.value.filter((motorcycle: any) =>
        (motorcycle.name && motorcycle.name.toLowerCase().includes(q)) ||
        (motorcycle.brandName && motorcycle.brandName.toLowerCase().includes(q)) ||
        (motorcycle.modelName && motorcycle.modelName.toLowerCase().includes(q))
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
      let routeName = 'motorcycles-edit';
      if (router.currentRoute.value.name === 'motorcycles-details') {
        routeName = 'motorcycles-details';
      }
      if (selectedItem.value !== null && filteredMotorcycles.value[selectedItem.value]) {
        router.push({
          name: routeName,
          params: { id: filteredMotorcycles.value[selectedItem.value].id }
        });
      }
    });

    const loadItems = async () => {
      try {
        const params = {
          search: search.value || null,
          page: 1,
          pageSize: 20,
        };
        await store.dispatch('motorcycles/loadMotorcycles', params);
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    onMounted(async () => {
      await loadItems();
      if (filteredMotorcycles.value) {
        const motorcycleIndex = filteredMotorcycles.value.findIndex(
          (motorcycle: any) => motorcycle.id === route.params.id
        );
        if (motorcycleIndex !== -1) {
          selectedItem.value = motorcycleIndex;
        }
      }
    });

    return {
      search,
      filteredMotorcycles,
      selectedItem,
    };
  },
};
</script>

<style scoped>
.v-list-search-result {
  max-height: 400px;
  overflow-y: auto;
}
</style>
