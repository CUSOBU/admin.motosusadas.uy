
<template>
  <div class="table-container">
    <datatable :headers="headers" :items="sellerVehicles" :total="total" :page="page" :items-per-page="itemsPerPage"
      @update:options="handleTableOptions" :loading="loading" class="v-data-table--in-row-headers" headerless>

      <template v-slot:item.images="{ item }">
        <div class="images-column">
          <v-icon v-if="item.isFeatured" color="warning" size="16" class="mr-1" title="Destacada">mdi-star</v-icon>
          <v-btn size="small" icon density="compact" class="action-btn images-action-btn" @click="info(item.id)">
            <v-icon size="24">mdi-image-multiple</v-icon>
          </v-btn>
          <span class="images-count">{{ (item.images && item.images.length) || 0 }}</span>
        </div>
      </template>

      <template v-slot:item.name="{ item }">
        <span>{{ item.brandName }} {{ item.modelName }}</span>
        <span>{{ item.name }}</span>
      </template>

      <template v-slot:item.year="{ item }">
        <span>{{ $t('year') }}</span>
        <span>{{ item.year }}</span>
      </template>

      <template v-slot:item.price="{ item }">
        <span>{{ $t('price') }}</span>
        <span>{{ formatPrice(item.price) }}</span>
      </template>

      <template v-slot:item.status="{ item }">
        <span>{{ $t('status') }}</span>
        <v-chip :color="getStatusColor(item.status)" size="small">
          {{ getStatusText(item.status) }}
        </v-chip>
      </template>

      <template v-slot:item.sellerName="{ item }">
        <span>{{ $t('seller') }}</span>
        <span>{{ item.sellerName || '-' }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="action-buttons">
          <v-btn size="small" icon density="compact" class="action-btn" @click="info(item.id)">
            <v-icon size="20">mdi-information-outline</v-icon>
          </v-btn>
          <v-btn size="small" icon density="compact" class="action-btn" @click="edit(item.id)" v-if="isAdmin">
            <v-icon color="primary" size="20">mdi-circle-edit-outline</v-icon>
          </v-btn>
          <v-btn size="small" icon density="compact" class="action-btn" @click="openRemoveDialog(item.id)" v-if="isAdmin">
            <v-icon color="error" size="20">mdi-delete-outline</v-icon>
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
import { SellerVehicleStatus } from "@/models/seller-vehicle.model";

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
    status: {
      type: [Number, null] as any,
      default: null
    },
    brandId: {
      type: [String, null] as any,
      default: null
    },
    modelId: {
      type: [String, null] as any,
      default: null
    },
    typeId: {
      type: [String, null] as any,
      default: null
    },
    locationId: {
      type: [String, null] as any,
      default: null
    },
    minPrice: {
      type: [Number, null] as any,
      default: null
    },
    maxPrice: {
      type: [Number, null] as any,
      default: null
    },
    minYear: {
      type: [Number, null] as any,
      default: null
    },
    maxYear: {
      type: [Number, null] as any,
      default: null
    },
    minKms: {
      type: [Number, null] as any,
      default: null
    },
    maxKms: {
      type: [Number, null] as any,
      default: null
    },
    minCubicCapacity: {
      type: [Number, null] as any,
      default: null
    },
    maxCubicCapacity: {
      type: [Number, null] as any,
      default: null
    }
  },

  setup(props: any) {
    const store = useStore();
    const page = ref(1);
    const itemsPerPage = ref(10);
    const sellerVehicles = computed(() => store.state.sellerVehicles.sellerVehicles || []);
    const total = computed(() => store.state.sellerVehicles.total || 0);
    const loading = computed(() => store.state.sellerVehicles.loading || false);
    const dialogVisibleId = ref<string | null>(null);
    const currentUser = computed(() => store.getters["auth/currentUser"]);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);

    const loadSellerVehicles = async (options: any = {}) => {
      try {
        const params = {
          search: props.search || null,
          status: props.status,
          brandId: props.brandId,
          modelId: props.modelId,
          typeId: props.typeId,
          locationId: props.locationId,
          minPrice: props.minPrice,
          maxPrice: props.maxPrice,
          minYear: props.minYear,
          maxYear: props.maxYear,
          minKms: props.minKms,
          maxKms: props.maxKms,
          minCubicCapacity: props.minCubicCapacity,
          maxCubicCapacity: props.maxCubicCapacity,
          page: options.page || page.value,
          pageSize: options.itemsPerPage || itemsPerPage.value,
        };

        // Admin can see all, agency only approved
        if (isAdmin.value) {
          await store.dispatch('sellerVehicles/loadAllSellerVehicles', params);
        } else {
          await store.dispatch('sellerVehicles/loadApprovedSellerVehicles', params);
        }
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    const handleTableOptions = (options: any) => {
      page.value = options.page;
      itemsPerPage.value = options.itemsPerPage;
      loadSellerVehicles(options);
    };

    watch([
      () => props.search,
      () => props.status,
      () => props.brandId,
      () => props.modelId,
      () => props.typeId,
      () => props.locationId,
      () => props.minPrice,
      () => props.maxPrice,
      () => props.minYear,
      () => props.maxYear,
      () => props.minKms,
      () => props.maxKms,
      () => props.minCubicCapacity,
      () => props.maxCubicCapacity
    ], () => {
      page.value = 1;
      loadSellerVehicles({
        page: page.value,
        itemsPerPage: itemsPerPage.value
      });
    });

    onMounted(() => {
      loadSellerVehicles({
        page: page.value,
        itemsPerPage: itemsPerPage.value
      });
    });

    const headers = computed(() => [
      {
        title: "",
        value: "images",
        align: "start",
        sortable: false,
      },
      {
        title: "Moto",
        value: "name",
        align: "start",
        sortable: false,
      },
      {
        title: "Año",
        value: "year",
        align: "start",
        sortable: false,
      },
      {
        title: "Precio",
        value: "price",
        align: "start",
        sortable: false,
      },
      {
        title: "Estado",
        value: "status",
        align: "start",
        sortable: false,
      },
      // Only show seller column for admin users
      ...(isAdmin.value ? [{
        title: "Vendedor",
        value: "sellerName",
        align: "start",
        sortable: false,
      }] : []),
      {
        title: 'Acciones',
        value: 'actions',
        align: 'center',
        sortable: false,
      },
    ]);

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'UYU',
      }).format(price);
    };

    const getStatusColor = (status: SellerVehicleStatus) => {
      switch (status) {
        case SellerVehicleStatus.Pending:
          return 'warning';
        case SellerVehicleStatus.Approved:
          return 'success';
        case SellerVehicleStatus.Rejected:
          return 'error';
        case SellerVehicleStatus.Contacted:
          return 'info';
        default:
          return 'grey';
      }
    };

    const getStatusText = (status: SellerVehicleStatus) => {
      switch (status) {
        case SellerVehicleStatus.Pending:
          return i18n.global.t('status-pending');
        case SellerVehicleStatus.Approved:
          return i18n.global.t('status-approved');
        case SellerVehicleStatus.Rejected:
          return i18n.global.t('status-rejected');
        case SellerVehicleStatus.Contacted:
          return i18n.global.t('status-contacted');
        default:
          return 'Unknown';
      }
    };

    const edit = (id: string) => {
      router.push({ name: 'seller-vehicles-edit', params: { id } });
    };

    const info = (id: string) => {
      router.push({ name: 'seller-vehicles-details', params: { id } });
    };

    const openRemoveDialog = (id: string) => {
      dialogVisibleId.value = id;
    };

    const onDialogUpdate = (val: boolean, id: string) => {
      if (!val && dialogVisibleId.value === id) dialogVisibleId.value = null;
    };

    return {
      headers,
      sellerVehicles,
      total,
      page,
      itemsPerPage,
      loading,
      handleTableOptions,
      edit,
      info,
      reload: loadSellerVehicles,
      formatPrice,
      getStatusColor,
      getStatusText,
      dialogVisibleId,
      openRemoveDialog,
      onDialogUpdate,
      isAdmin,
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

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  min-height: auto;
}

.action-btn {
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
}

.images-column {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.images-count {
  font-size: 13px;
  color: rgba(0,0,0,0.7);
}


:deep(.v-data-table tbody tr td) {
  vertical-align: middle !important;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}
</style>
