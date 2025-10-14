<template>
  <div class="table-container">
    <datatable :headers="headers" :items="users" :items-per-page="itemsPerPage" :total-items="total"
      :page="page" @update:options="handleTableOptions" class="v-data-table--in-row-headers" headerless>
      <template v-slot:item.fullName="{ item }">
        <span>{{ getRoleLabel(item.authLevel) }}</span>
        <span>{{ item.fullName }}</span>
      </template>
      <template v-slot:item.email="{ item }">
        <span>{{ $t('email') }}</span>
        <span>{{ item.email }}</span>
      </template>
      <template v-slot:item.active="{ item }">
        <v-chip :color="item.active ? 'success' : 'error'" size="small">
          {{ item.active ? $t('active') : $t('inactive') }}
        </v-chip>
      </template>
      <template v-slot:item.agencyName="{ item }">
        <span>{{ $t('agency') }}</span>
        <span>{{ item.agencyName || '-' }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="payment-buttons buttons buttons--4" style="white-space: nowrap">
          <v-btn small icon class="pl-0 pr-0 fg-primary" @click="info(item.id)">
            <v-icon max-width="22px">mdi-information-outline</v-icon>
          </v-btn>
          <v-btn small icon class="ml-2 pl-0 pr-0 " @click="edit(item.id)">
            <v-icon color="primary" max-width="40px">mdi-circle-edit-outline</v-icon>
          </v-btn>
          <v-btn small icon class="ml-2 pl-0 pr-0" @click="openRemoveDialog(item.id)">
            <v-icon color="error" max-width="40px">mdi-delete-outline</v-icon>
          </v-btn>
          <RemoveDialog :item="item" :show="dialogVisibleId === item.id" @removed="reload" @update:show="val => onDialogUpdate(val, item.id)" />
        </div>
      </template>
    </datatable>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import Datatable from "../components/Datatable.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from 'vuex';
import RemoveDialog from "./RemoveDialog.vue";
import Roles from "@/constants/Roles";
import i18n from "@/plugins/i18n";

export default {
  components: {
    Datatable,
    RemoveDialog
  },
  props: {
    search: {
      type: String,
      default: "",
    },
    active: {
      type: [Boolean, null] as any,
      default: null
    },
    authLevel: {
      type: [Number, null] as any,
      default: null
    }
  },

  setup(props: any) {
    const store = useStore();
    const page = ref(1);
    const itemsPerPage = ref(10);
    const users = computed(() => store.state.users.users || []);
    const total = computed(() => store.state.users.total || 0);
    const dialogVisibleId = ref<string | null>(null);

    const loadUsers = async (options: any = {}) => {
      try {
        const params = {
          search: props.search || null,
          limit: options.itemsPerPage || itemsPerPage.value,
          offset: ((options.page || page.value) - 1) * (options.itemsPerPage || itemsPerPage.value),
          active: props.active,
          authLevel: props.authLevel
        };

        await store.dispatch('users/loadUsers', params);
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    const handleTableOptions = (options: any) => {
      page.value = options.page;
      itemsPerPage.value = options.itemsPerPage;
      loadUsers(options);
    };

    watch([() => props.search, () => props.active, () => props.authLevel], () => {
      page.value = 1;
      loadUsers({
        page: page.value,
        itemsPerPage: itemsPerPage.value
      });
    });

    onMounted(() => {
      loadUsers({
        page: page.value,
        itemsPerPage: itemsPerPage.value
      });
    });

    const headers = computed(() => [
      {
        title: "Usuario",
        value: "fullName",
        align: "start",
        sortable: false,
      },
      {
        title: "Email",
        value: "email",
        align: "start",
        sortable: false,
      },
      {
        title: "Estado",
        value: "active",
        align: "start",
        sortable: false,
      },
      {
        title: "Agencia",
        value: "agencyName",
        align: "start",
        sortable: false,
      },
      {
        title: 'Acciones',
        value: 'actions',
        align: 'center',
        sortable: false,
      },
    ]);

    const getRoleLabel = (authLevel: number) => {
      if (authLevel === Roles.Admin) return i18n.global.t('roles.admin');
      if (authLevel === Roles.Agency) return i18n.global.t('roles.agency');
      return '';
    };

    const edit = (id: string) => {
      router.push({ name: 'users-edit', params: { id } });
    };

    const info = (id: string) => {
      router.push({ name: 'users-details', params: { id } });
    };

    const openRemoveDialog = (id: string) => {
      dialogVisibleId.value = id;
    };

    const onDialogUpdate = (val: boolean, id: string) => {
      if (!val && dialogVisibleId.value === id) dialogVisibleId.value = null;
    };

    return {
      headers,
      users,
      total,
      page,
      itemsPerPage,
      handleTableOptions,
      edit,
      info,
      reload: loadUsers,
      getRoleLabel,
      dialogVisibleId,
      openRemoveDialog,
      onDialogUpdate,
    };
  }
};
</script>

<style scoped lang="scss">
.table-container {
  width: 100%;
}

:deep(.v-data-table) {
  width: 100%;
  min-width: 600px;
}

.payment-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
