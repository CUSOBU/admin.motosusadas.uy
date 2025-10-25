<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="goBack" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h2>{{ $t("users-.details") }}</h2>
            <p>{{ $t("users-.details-sub-heading") }}</p>
          </div>
        </div>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>

  <SplitContent v-show="!isLoading" :hide-auxiliar="!user">
      <template #auxiliar>
        <search-users />
      </template>

      <v-container fluid>
        <v-row v-if="user">
          <v-col>
            <h4 class="fg-primary">{{ getRoleLabel(user.authLevel) }}</h4>
            <attribute>
              <template #name>{{ $t("name") }}</template>
              {{ user.fullName }}
            </attribute>
          </v-col>
          <v-col cols="6" class="svg-buttons small-buttons text-right">
            <v-btn small text class="fg-blue" @click="user && edit(user.id)">
              <v-icon small>mdi-pencil</v-icon>
              {{ $t("edit") }}
            </v-btn>
            <v-btn small text class="fg-red" @click="dialogVisible = true">
              <v-icon small>mdi-delete</v-icon>
              {{ $t("delete") }}
            </v-btn>
          </v-col>
        </v-row>

  <RemoveDialog :item="user" :show="dialogVisible" @removed="onRemoved" @update:show="dialogVisible = $event" />

        <v-row>
          <v-col>
            <h4 class="fg-primary">{{ $t("account") }}</h4>
          </v-col>
        </v-row>

        <v-row class="bottom-lined" v-if="user">
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("email") }}</template>
              {{ user.email }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("agency") }}</template>
              {{ user.agencyName || '-' }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("active") }}</template>
              {{ user.active ? $t("yes") : $t("no") }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("createdAt") }}</template>
              {{ formatDate(user.createdAt) }}
            </attribute>
          </v-col>
          <v-col cols="6">
          <attribute>
            <template #name>{{ $t('phoneNumber') }}</template>
            {{ user.phoneNumber || '-' }}
          </attribute>
        </v-col>
        </v-row>
      </v-container>
    </SplitContent>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Heading from '@/views/components/Heading.vue';
import SplitContent from '@/views/components/SplitView.vue';
import searchUsers from './Search.vue';
import { useRouter, useRoute } from 'vue-router';
import userService from '@/services/userService';
import { User } from '@/models/user.model';
import Attribute from '@/views/components/Attribute.vue';
import RemoveDialog from './RemoveDialog.vue';
import i18n from '@/plugins/i18n';

export default {
  components: {
    Heading,
    SplitContent,
    searchUsers,
    Attribute,
    RemoveDialog,
  },

  setup() {
    const store = useStore();
    const user = ref<User | null>(null);
    const router = useRouter();
    const route = useRoute();
    const dialogVisible = ref<boolean>(false);
    const isLoading = ref<boolean>(true);

    const edit = (id: string) => {
      router.push({ name: 'users-edit', params: { id } });
    };

    const goBack = () => {
      router.push({ name: 'users' });
    };

    const remove = async () => {
      if (!user.value) return;
      try {
        await store.dispatch('users/deleteUser', user.value.id);
        dialogVisible.value = false;
        router.push({ name: 'users' });
        await store.dispatch('users/loadUsers');
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    const onRemoved = async () => {
      dialogVisible.value = false;
      try {
        await Promise.resolve();
        await new Promise((r) => setTimeout(r, 120));

        user.value = null;
        await store.dispatch('users/loadUsers');
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
      router.push({ name: 'users' });
    };

    const loadUser = async (id: string) => {
      try {
        store.dispatch('SET_LOADING', true);
        const fetched = await userService.getUserById(id);
        user.value = fetched || null;
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
        user.value = null;
      } finally {
        store.dispatch('SET_LOADING', false);
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      const id = route.params.id;
      if (typeof id === 'string') {
        await loadUser(id);
      } else {
        isLoading.value = false;
      }
    });

    watch(() => route.params.id, async (newId: string | string[]) => {
      if (typeof newId === 'string') {
        await loadUser(newId);
      }
    });

    const getRoleLabel = (authLevel: number) => {
      if (authLevel === 1) return i18n.global.t('roles.agency');
      if (authLevel === 2) return i18n.global.t('roles.admin');
      return '';
    };

    const formatDate = (d?: string) => {
      if (!d) return '-';
      try {
        const dt = new Date(d);
        return dt.toLocaleString();
      } catch (e) {
        return d;
      }
    };

    return {
      user,
      isLoading,
      edit,
      goBack,
      remove,
      onRemoved,
      dialogVisible,
      getRoleLabel,
      formatDate,
    };
  },
};
</script>

<style scoped lang="scss">
.v-chip {
  font-size: 0.75rem;
  height: 20px !important;
}
</style>
