<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="goBack" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h2>{{ $t("motorcycles-.details") }}</h2>
            <p>{{ $t("motorcycles-.details-sub-heading") }}</p>
          </div>
        </div>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>

    <SplitContent v-if="!isLoading" :hide-auxiliar="!motorcycle">
      <template #auxiliar>
        <!-- Mobile: Search in accordion -->
        <div class="d-md-none">
          <v-expansion-panels variant="accordion" v-model="mobileSearchExpanded">
            <v-expansion-panel>
              <v-expansion-panel-title class="mobile-search-title">
                <v-icon class="mr-2">mdi-magnify</v-icon>
                <h4>{{ $t("search") }}</h4>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <search-motorcycles />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!-- Desktop: Original layout -->
        <div class="d-none d-md-block">
          <search-motorcycles />
        </div>
      </template>

      <v-container fluid>
        <v-row v-if="motorcycle">
          <v-col cols="12" md="8">
            <h4 class="fg-primary">{{ motorcycle.brandName }} {{ motorcycle.modelName }}</h4>
            <attribute>
              <template #name>{{ $t("motorcycle-name") }}</template>
              {{ motorcycle.name }}
            </attribute>
          </v-col>
          <v-col cols="12" md="4" class="action-buttons-container">
            <div class="action-buttons">
              <v-btn small text class="fg-blue" @click="motorcycle && edit(motorcycle.id)" v-if="canEdit">
                <v-icon small>mdi-pencil</v-icon>
                {{ $t("edit") }}
              </v-btn>
              <v-btn small text class="fg-red" @click="dialogVisible = true" v-if="canDelete">
                <v-icon small>mdi-delete</v-icon>
                {{ $t("delete") }}
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <RemoveDialog :item="motorcycle" :show="dialogVisible" @removed="onRemoved" @update:show="dialogVisible = $event" />

        <v-row>
          <v-col>
            <h4 class="fg-primary">{{ $t("basic-info") }}</h4>
          </v-col>
        </v-row>

        <v-row class="bottom-lined" v-if="motorcycle">
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("brand") }}</template>
              {{ motorcycle.brandName }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("model") }}</template>
              {{ motorcycle.modelName }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("type") }}</template>
              {{ motorcycle.typeName }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("location") }}</template>
              {{ motorcycle.locationName }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("year") }}</template>
              {{ motorcycle.year }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("price") }}</template>
              {{ formatPrice(motorcycle.price) }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("cubic-capacity") }}</template>
              {{ motorcycle.cubicCapacity }} cc
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("kms") }}</template>
              {{ formatNumber(motorcycle.kms) }} km
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("operation-type") }}</template>
              {{ getOperationLabel(motorcycle.operation) }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("views") }}</template>
              {{ motorcycle.views }}
            </attribute>
          </v-col>
          <v-col cols="6">
            <attribute>
              <template #name>{{ $t("active") }}</template>
              {{ motorcycle.active ? $t("yes") : $t("no") }}
            </attribute>
          </v-col>
          <v-col cols="6" v-if="motorcycle.agencyName">
            <attribute>
              <template #name>{{ $t("agency") }}</template>
              {{ motorcycle.agencyName }}
            </attribute>
          </v-col>
        </v-row>

        <!-- Image Management Section -->
        <v-row v-if="motorcycle">
          <v-col>
            <h4 class="fg-primary">{{ $t("images") }}</h4>
          </v-col>
        </v-row>

        <!-- Image Upload Component (Maquetado - Sin funcionalidad) -->
        <v-row v-if="motorcycle && (canEdit || canDelete)">
          <v-col cols="12">
            <v-alert type="info" variant="tonal" class="mb-4">
              {{ $t("image-upload-coming-soon") || "La funcionalidad de carga de imágenes estará disponible próximamente" }}
            </v-alert>
            <!-- 
            <ImageUpload
              :entity-id="motorcycle.id"
              :section-title="$t('upload-motorcycle-image')"
              :section-description="$t('upload-motorcycle-image-description')"
              :current-image-url="null"
              :service="motorcycleImageService"
              store-module="motorcycles"
              fetch-action="loadMotorcycle"
              @image-uploaded="onImageUploaded"
              @image-removed="onImageRemoved"
            />
            -->
          </v-col>
        </v-row>

        <v-row v-if="motorcycle && motorcycle.images && motorcycle.images.length > 0">
          <v-col cols="12" md="4" v-for="image in motorcycle.images" :key="image.id">
            <v-img :src="image.path" aspect-ratio="1.5" cover class="rounded"></v-img>
          </v-col>
        </v-row>
      </v-container>
    </SplitContent>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import Heading from '@/views/components/Heading.vue';
import SplitContent from '@/views/components/SplitView.vue';
import searchMotorcycles from './Search.vue';
import { useRouter, useRoute } from 'vue-router';
import { Motorcycle } from '@/models/motorcycle.model';
import Attribute from '@/views/components/Attribute.vue';
import RemoveDialog from './RemoveDialog.vue';
import i18n from '@/plugins/i18n';
import Roles from '@/constants/Roles';

export default {
  components: {
    Heading,
    SplitContent,
    searchMotorcycles,
    Attribute,
    RemoveDialog,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const isLoading = ref(true);
    const motorcycle = ref<Motorcycle | null>(null);
    const dialogVisible = ref(false);
    const mobileSearchExpanded = ref<number[]>([]);
    const currentUser = computed(() => store.getters["auth/currentUser"]);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);

    const canEdit = computed(() => {
      if (!motorcycle.value) return false;
      if (isAdmin.value) return true;
      return motorcycle.value.userId === currentUser.value?.id;
    });

    const canDelete = computed(() => {
      if (!motorcycle.value) return false;
      if (isAdmin.value) return true;
      return motorcycle.value.userId === currentUser.value?.id;
    });

    const loadMotorcycle = async (id: string) => {
      try {
        isLoading.value = true;
        const result = await store.dispatch('motorcycles/loadMotorcycle', id);
        motorcycle.value = result;
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
        motorcycle.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    watch(
      () => route.params.id,
      async (newId) => {
        if (typeof newId === 'string') {
          await loadMotorcycle(newId);
        }
      },
      { immediate: true }
    );

    const edit = (id: string) => {
      router.push({ name: 'motorcycles-edit', params: { id } });
    };

    const goBack = () => {
      router.push({ name: 'motorcycles' });
    };

    const onRemoved = () => {
      dialogVisible.value = false;
      router.push({ name: 'motorcycles' });
    };

    const getOperationLabel = (operation: number) => {
      if (operation === 0) return i18n.global.t('operation.sale');
      if (operation === 1) return i18n.global.t('operation.rent');
      if (operation === 2) return i18n.global.t('operation.both');
      return '';
    };

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'UYU',
      }).format(price);
    };

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('es-UY').format(num);
    };

    return {
      motorcycle,
      isLoading,
      dialogVisible,
      edit,
      goBack,
      onRemoved,
      getOperationLabel,
      formatPrice,
      formatNumber,
      canEdit,
      canDelete,
      mobileSearchExpanded,
    };
  },
};
</script>

<style scoped>

.mobile-search-title {
  background-color: #f6f9f6;
  color: #2d6283;
  font-weight: 600;
  border-radius: 12px !important;
}

.mobile-search-title :deep(.v-expansion-panel-title__icon) {
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

.action-buttons-container {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 0;
}

@media (max-width: 959px) {
  .action-buttons-container {
    justify-content: flex-start;
    margin-top: 8px;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }
}

.bottom-lined {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.fg-primary {
  color: var(--v-primary-base);
}

.fg-blue {
  color: #2196F3;
}

.fg-red {
  color: #f44336;
}

.svg-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.rounded {
  border-radius: 8px;
}
</style>
