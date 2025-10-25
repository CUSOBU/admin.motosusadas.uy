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
            <v-list-item v-for="(item, i) in filteredSellerVehicles" :key="i" color="primary" @click="selectedItem = i"
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
import Roles from '@/constants/Roles';

export default {
  name: 'SearchSellerVehicles',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const timeout = ref<number | null>(null);
    const search = ref('');
    const selectedItem = ref<number | null>(null);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);

    const sellerVehicles = computed(() => store.state.sellerVehicles.sellerVehicles || []);

    const filteredSellerVehicles = computed(() => {
      if (!search.value) {
        return sellerVehicles.value;
      }
      const q = search.value.toLowerCase();
      return sellerVehicles.value.filter((v: any) =>
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.brandName && v.brandName.toLowerCase().includes(q)) ||
        (v.modelName && v.modelName.toLowerCase().includes(q))
      );
    });

    watch(search, async () => {
      if (timeout.value) {
        clearTimeout(timeout.value);
      }
      timeout.value = window.setTimeout(() => {
        loadItems();
      }, 1000);
    });

    watch(selectedItem, async (index) => {
      let routeName = 'seller-vehicles-edit';
      if (router.currentRoute.value.name === 'seller-vehicles-details') {
        routeName = 'seller-vehicles-details';
      }
      if (selectedItem.value !== null && filteredSellerVehicles.value[selectedItem.value]) {
        router.push({ name: routeName, params: { id: filteredSellerVehicles.value[selectedItem.value].id } });
      }
    });

    const loadItems = async () => {
      try {
        const params = {
          search: search.value || null,
          page: 1,
          pageSize: 20,
        };
        if (isAdmin.value) {
          await store.dispatch('sellerVehicles/loadAllSellerVehicles', params);
        } else {
          await store.dispatch('sellerVehicles/loadApprovedSellerVehicles', params);
        }
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    onMounted(async () => {
      await loadItems();
      if (filteredSellerVehicles.value) {
        const index = filteredSellerVehicles.value.findIndex((v: any) => v.id === route.params.id);
        if (index !== -1) selectedItem.value = index;
      }
    });

    return {
      search,
      filteredSellerVehicles,
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
