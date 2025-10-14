<template>
  <div class="table-container">
    <datatable :headers="headers" :items="locations" :items-per-page="itemsPerPage" :page="page"
      @update:options="handleTableOptions" class="v-data-table--in-row-headers" headerless>
      <template v-slot:item.name="{ item }">
        <span>{{ $t('name') }}</span>
        <span>{{ item.name }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="payment-buttons buttons buttons--3" style="white-space: nowrap">
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
    }
  },

  setup(props: any) {
    const store = useStore();
    const page = ref(1);
    const itemsPerPage = ref(10);
    const locations = computed(() => store.state.locations.locations || []);
    const dialogVisibleId = ref<string | null>(null);

    const loadLocations = async (options: any = {}) => {
      try {
        const params = {
          search: props.search || null,
        };

        await store.dispatch('locations/loadLocations', params);
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    const handleTableOptions = (options: any) => {
      page.value = options.page;
      itemsPerPage.value = options.itemsPerPage;
      loadLocations(options);
    };

    watch([() => props.search], () => {
      loadLocations();
    });

    onMounted(() => {
      loadLocations();
    });

    const headers = computed(() => [
      {
        title: "Nombre",
        value: "name",
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

    const edit = (id: string) => {
      router.push({ name: 'locations-edit', params: { id } });
    };

    const info = (id: string) => {
      router.push({ name: 'locations-details', params: { id } });
    };

    const openRemoveDialog = (id: string) => {
      dialogVisibleId.value = id;
    };

    const onDialogUpdate = (val: boolean, id: string) => {
      if (!val) {
        dialogVisibleId.value = null;
      }
    };

    const reload = () => {
      loadLocations();
    };

    return {
      locations,
      headers,
      page,
      itemsPerPage,
      handleTableOptions,
      edit,
      info,
      openRemoveDialog,
      dialogVisibleId,
      onDialogUpdate,
      reload,
    };
  },
};
</script>

<style scoped>
.table-container {
  width: 100%;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
