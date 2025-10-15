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
            <v-list-item v-for="(item, i) in filteredBrands" :key="i" color="primary" @click="selectedItem = i"
              :selected="selectedItem === i">
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
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
  name: 'SearchBrands',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const timeout = ref<number | null>(null);
    const search = ref("");
    const selectedItem = ref<number | null>(null);
    const brands = computed(() => store.state.brands.brands || []);

    const filteredBrands = computed(() => {
      if (!search.value) {
        return brands.value;
      }
      const q = search.value.toLowerCase();
      return brands.value.filter((location: any) =>
        (location.name && location.name.toLowerCase().includes(q))
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
      let routeName = 'brands-edit';
      if (router.currentRoute.value.name === 'brands-details') {
        routeName = 'brands-details';
      }
      if (selectedItem.value !== null && filteredBrands.value[selectedItem.value]) {
        router.push({
          name: routeName,
          params: { id: filteredBrands.value[selectedItem.value].id }
        });
      }
    });

    const loadItems = async () => {
      try {
        const params = {
          search: search.value || null,
        };
        await store.dispatch('brands/loadBrands', params);
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    onMounted(async () => {
      await loadItems();
      if (filteredBrands.value) {
        const locationIndex = filteredBrands.value.findIndex(
          (location: any) => location.id === route.params.id
        );
        if (locationIndex !== -1) {
          selectedItem.value = locationIndex;
        }
      }
    });

    return {
      search,
      filteredBrands,
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
