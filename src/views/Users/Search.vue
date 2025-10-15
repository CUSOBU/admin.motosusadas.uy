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
            <v-list-item v-for="(item, i) in filteredUsers" :key="i" color="primary" @click="selectedItem = i"
              :selected="selectedItem === i">
              <v-list-item-title>
                {{ item.fullName ? item.fullName : item.phoneNumber }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="text--primary">{{ $t('roles.' + getRoleKey(item.authLevel)) }}:</span>
                {{ item.email ? item.email : item.phoneNumber }}
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
  name: 'SearchUsers',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const timeout = ref<number | null>(null);
    const search = ref("");
    const selectedItem = ref<number | null>(null);
    const users = computed(() => store.state.users.users || []);

    const filteredUsers = computed(() => {
      if (!search.value) {
        return users.value;
      }
      const q = search.value.toLowerCase();
      return users.value.filter((user: any) =>
        (user.fullName && user.fullName.toLowerCase().includes(q)) ||
        (user.email && user.email.toLowerCase().includes(q)) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(q))
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
      let routeName = 'users-edit';
      if (router.currentRoute.value.name === 'users-details') {
        routeName = 'users-details';
      }
      if (selectedItem.value !== null && filteredUsers.value[selectedItem.value]) {
        router.push({
          name: routeName,
          params: { id: filteredUsers.value[selectedItem.value].id }
        });
      }
    });

    const loadItems = async () => {
      try {
        const params = {
          search: search.value || null,
          limit: 20,
          offset: 0,
        };
        await store.dispatch('users/loadUsers', params);
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    onMounted(async () => {
      await loadItems();
      if (filteredUsers.value) {
        const userIndex = filteredUsers.value.findIndex(
          (user: any) => user.id === route.params.id
        );
        if (userIndex !== -1) {
          selectedItem.value = userIndex;
        }
      }
    });

    const getRoleKey = (authLevel: number) => {
      if (authLevel === Roles.Admin) return 'admin';
      if (authLevel === Roles.Agency) return 'agency';
      return 'agency';
    };

    return {
      users,
      timeout,
      search,
      selectedItem,
      loadItems,
      filteredUsers,
      getRoleKey,
    };
  },
};
</script>

<style lang="scss" scoped>
.v-list-item-title {
  color: #2D6283;
}
</style>
