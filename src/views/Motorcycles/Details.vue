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
          <v-col cols="12" md="10">
            <h4 class="fg-primary mb-1">{{ motorcycle.brandName }} {{ motorcycle.modelName }}</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ motorcycle.name }}</p>
          </v-col>
          <v-col cols="12" md="2" class="action-buttons-container">
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

        <v-row class="bottom-lined info-grid" v-if="motorcycle">
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("brand") }}</template>
              {{ motorcycle.brandName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("model") }}</template>
              {{ motorcycle.modelName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("type") }}</template>
              {{ motorcycle.typeName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("location") }}</template>
              {{ motorcycle.locationName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("year") }}</template>
              {{ motorcycle.year }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("price") }}</template>
              {{ formatPrice(motorcycle.price) }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("cubic-capacity") }}</template>
              {{ motorcycle.cubicCapacity }} cc
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("kms") }}</template>
              {{ formatNumber(motorcycle.kms) }} km
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("operation-type") }}</template>
              {{ getOperationLabel(motorcycle.operation) }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("views") }}</template>
              {{ motorcycle.views }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("active") }}</template>
              {{ motorcycle.active ? $t("yes") : $t("no") }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4" v-if="motorcycle.agencyName">
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

        <!-- Image Upload Section -->
        <v-row v-if="motorcycle && (canEdit || canDelete)">
          <v-col cols="12">
            <div class="image-upload-section">
              
              <!-- ImageUpload component (supports multiple files) -->
              <ImageUpload
                :entityId="motorcycle.id"
                :service="motorcycleImageService"
                store-module="motorcycles"
                fetch-action="loadMotorcycle"
                :section-title="$t('add-image')"
                :section-description="$t('upload-images-description')"
                :multiple="true"
                @image-uploaded="onImagesUploaded"
              />
            </div>
          </v-col>
        </v-row>

        <!-- Existing Images Grid -->
        <v-row v-if="motorcycle && motorcycle.images && motorcycle.images.length > 0">
          <v-col cols="12" md="4" v-for="image in motorcycle.images" :key="image.id">
            <v-card class="image-card">
              <v-img
                :src="image.url ? image.url : buildImageUrl(image.path)"
                aspect-ratio="1.5"
                cover
                class="rounded"
                @click="openPreview(image.url ? image.url : buildImageUrl(image.path))"
              ></v-img>
              <v-card-actions v-if="canEdit || canDelete">
                <v-spacer></v-spacer>
                <confirm-dialog
                  v-model="deleteImageDialog"
                  @confirmed="executeDeleteImage"
                >
                  <template #activator>
                    <v-btn
                      color="error"
                      variant="text"
                      size="small"
                      @click="confirmDeleteImage(image.id)"
                      :loading="deletingImageId === image.id"
                    >
                      <v-icon>mdi-delete</v-icon>
                      {{ $t("delete") }}
                    </v-btn>
                  </template>
                  <template #title>
                    {{ $t("confirm-delete-image") }}
                  </template>
                  {{ $t("confirm-delete-image") }}
                </confirm-dialog>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else-if="motorcycle">
          <v-col cols="12">
            <v-alert type="info" variant="tonal">
              {{ $t("no-images-yet") }}
            </v-alert>
          </v-col>
        </v-row>
        <!-- Preview Dialog -->
        <v-dialog v-model="previewDialog" max-width="800px">
          <v-card>
            <v-img :src="previewImageUrl" aspect-ratio="16/9" cover></v-img>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="previewDialog = false">{{ $t('close') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import motorcycleImageService, { validateImageFile } from '@/services/motorcycleImageService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import ImageUpload from '../components/ImageUpload.vue';

export default {
  components: {
    Heading,
    SplitContent,
    searchMotorcycles,
    Attribute,
    RemoveDialog,
    ConfirmDialog,
    ImageUpload,
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

  // Image upload state handled by ImageUpload component
    const deletingImageId = ref<string | null>(null);
    const deleteImageDialog = ref(false);
    const imageToDelete = ref<string | null>(null);
  const previewDialog = ref(false);
  const previewImageUrl = ref<string | null>(null);

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

    // Image upload validation
    // Handler called when child ImageUpload emits 'image-uploaded'
    const onImagesUploaded = async () => {
      if (!motorcycle.value) return;
      await loadMotorcycle(motorcycle.value.id);
    };

    // Delete image
    const confirmDeleteImage = (imageId: string) => {
      imageToDelete.value = imageId;
      deleteImageDialog.value = true;
    };

    const executeDeleteImage = async () => {
      if (!motorcycle.value || !imageToDelete.value) return;

      try {
        deletingImageId.value = imageToDelete.value;
        await motorcycleImageService.deleteImage(motorcycle.value.id, imageToDelete.value);
        
        // Reload motorcycle to get updated images
        await loadMotorcycle(motorcycle.value.id);
        
        store.dispatch('notificator/success', i18n.global.t('image-deleted-successfully'));
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        deletingImageId.value = null;
        imageToDelete.value = null;
      }
    };

    const buildImageUrl = (path: string) => {
      if (!path) return '';
      // Si el backend ya devuelve URL completa, usar image.url. Si no, construir desde origen/apifiles
      try {
        // Preferir variable de entorno si existe
        const apiBase = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE) || window.location.origin;
        // Si path ya parece una URL completa, devolverla
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        // Construir URL a /api/files/{path}
        return `${apiBase.replace(/\/$/, '')}/api/files/${path}`;
      } catch (e) {
        return `/api/files/${path}`;
      }
    };

    const getFilePreview = (file: File): string => {
      try {
        return URL.createObjectURL(file);
      } catch (e) {
        return '';
      }
    };

    const openPreview = (url: string) => {
      previewImageUrl.value = url;
      previewDialog.value = true;
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
      deletingImageId,
      confirmDeleteImage,
      executeDeleteImage,
      buildImageUrl,
      motorcycleImageService,
      deleteImageDialog,
      imageToDelete,
      previewDialog,
      previewImageUrl,
      openPreview,
      onImagesUploaded,
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
  align-items: center;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  align-items: center;
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
    flex-wrap: wrap; /* allow wrap on smaller screens */
  }
}

.bottom-lined {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.info-grid {
  row-gap: 4px;
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

.image-upload-section {
  background-color: #f6f9f6;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.image-card {
  position: relative;
  transition: all 0.3s ease;
}

.image-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.file-activator-container {
  width: 100%;
  max-width: 480px;
}

.fake-input-with-preview {
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  min-height: 56px;
}

.thumbnails-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.thumbnail-item {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-count {
  font-size: 12px;
  font-weight: 600;
  color: #1976D2;
  padding: 0 8px;
}

.fake-input {
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
}

.file-placeholder {
  color: rgba(0,0,0,0.5);
  font-size: 14px;
}

.file-attach-btn {
  min-width: 140px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}
</style>