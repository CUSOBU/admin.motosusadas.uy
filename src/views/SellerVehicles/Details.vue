<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="goBack" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h2>{{ $t("seller-vehicle-details") }}</h2>
            <p>{{ $t("seller-vehicle-details-sub-heading") }}</p>
          </div>
        </div>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>

    <SplitContent v-if="!isLoading" :hide-auxiliar="!sellerVehicle">
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
                <search-seller-vehicles />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!-- Desktop: Original layout -->
        <div class="d-none d-md-block">
          <search-seller-vehicles />
        </div>
      </template>

      <v-container fluid>
        <v-row v-if="sellerVehicle">
          <v-col cols="12" md="10">
            <h4 class="fg-primary mb-1">{{ sellerVehicle.brandName }} {{ sellerVehicle.modelName }}</h4>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ sellerVehicle.name }}</p>
          </v-col>
          <v-col cols="12" md="2" class="action-buttons-container">
            <div class="action-buttons">
              <v-btn small text class="fg-blue" @click="sellerVehicle && edit(sellerVehicle.id)" v-if="isAdmin">
                <v-icon small>mdi-pencil</v-icon>
                {{ $t("edit") }}
              </v-btn>
              <v-btn small text class="fg-red" @click="dialogVisible = true" v-if="isAdmin">
                <v-icon small>mdi-delete</v-icon>
                {{ $t("delete") }}
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <RemoveDialog :item="sellerVehicle" :show="dialogVisible" @removed="onRemoved" @update:show="dialogVisible = $event" />

        <v-row>
          <v-col>
            <h4 class="fg-primary">{{ $t("basic-info") }}</h4>
          </v-col>
        </v-row>

        <v-row class="bottom-lined info-grid" v-if="sellerVehicle">
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("brand") }}</template>
              {{ sellerVehicle.brandName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("model") }}</template>
              {{ sellerVehicle.modelName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("type") }}</template>
              {{ sellerVehicle.typeName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("location") }}</template>
              {{ sellerVehicle.locationName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("year") }}</template>
              {{ sellerVehicle.year }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("price") }}</template>
              {{ formatPrice(sellerVehicle.price) }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("cubic-capacity") }}</template>
              {{ sellerVehicle.cubicCapacity }} cc
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("kms") }}</template>
              {{ formatNumber(sellerVehicle.kms) }} km
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("vehicle-status") }}</template>
              <v-chip :color="getStatusColor(sellerVehicle.status)" size="small">
                {{ getStatusText(sellerVehicle.status) }}
              </v-chip>
            </attribute>
          </v-col>
        </v-row>

        <!-- Seller Information -->
        <v-row v-if="sellerVehicle">
          <v-col>
            <h4 class="fg-primary">{{ $t("seller-info") }}</h4>
          </v-col>
        </v-row>

        <v-row class="bottom-lined info-grid" v-if="sellerVehicle">
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("seller-name") }}</template>
              {{ sellerVehicle.sellerName }}
            </attribute>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("seller-phone") }}</template>
              {{ sellerVehicle.sellerPhone }}
            </attribute>
            <v-btn
              color="success"
              variant="text"
              size="small"
              class="mt-2 whatsapp-btn"
              @click="openWhatsApp(sellerVehicle.sellerPhone, sellerVehicle.brandName, sellerVehicle.modelName)"
            >
              <v-icon small class="mr-1">mdi-whatsapp</v-icon>
              <span class="whatsapp-label">{{ $t("contact-via-whatsapp") }}</span>
            </v-btn>
          </v-col>
          <v-col cols="6" md="4">
            <attribute>
              <template #name>{{ $t("seller-email") }}</template>
              {{ sellerVehicle.sellerEmail }}
            </attribute>
          </v-col>
        </v-row>

        <!-- Description -->
        <v-row v-if="sellerVehicle && sellerVehicle.description">
          <v-col>
            <h4 class="fg-primary">{{ $t("description") }}</h4>
          </v-col>
        </v-row>

        <v-row v-if="sellerVehicle && sellerVehicle.description" class="bottom-lined">
          <v-col cols="12">
            <p class="text-body-1">{{ sellerVehicle.description }}</p>
          </v-col>
        </v-row>

        <!-- Image Management Section -->
        <v-row v-if="sellerVehicle">
          <v-col>
            <h4 class="fg-primary">{{ $t("images") }}</h4>
          </v-col>
        </v-row>

        <!-- Existing Images Grid -->
        <v-row v-if="sellerVehicle && sellerVehicle.images && sellerVehicle.images.length > 0">
          <v-col cols="12" md="4" v-for="image in sellerVehicle.images" :key="image.id">
            <v-card class="image-card">
              <v-img
                :src="image.url"
                aspect-ratio="1.5"
                cover
                class="rounded"
                @click="openPreview(image.url)"
              ></v-img>
              <v-card-actions v-if="isAdmin">
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
                  {{ $t("delete-image-confirmation") }}
                </confirm-dialog>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- No images message -->
        <v-row v-else-if="sellerVehicle">
          <v-col cols="12">
            <p class="text-body-2 text-medium-emphasis">{{ $t("no-images") }}</p>
          </v-col>
        </v-row>
      </v-container>
    </SplitContent>

    <!-- Image Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="1200">
      <v-card>
        <v-card-text class="pa-0">
          <v-img :src="previewImageUrl" contain max-height="80vh"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="previewDialog = false">{{ $t("close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Heading from "../components/Heading.vue";
import SplitContent from "../components/SplitView.vue";
import Attribute from "../components/Attribute.vue";
import RemoveDialog from "./RemoveDialog.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import searchSellerVehicles from "./Search.vue";
import Roles from "@/constants/Roles";
import { SellerVehicleStatus } from "@/models/seller-vehicle.model";
import i18n from "@/plugins/i18n";
import sellerVehicleImageService from "@/services/sellerVehicleImageService";

export default {
  components: {
    Heading,
    SplitContent,
    Attribute,
    RemoveDialog,
    ConfirmDialog,
    searchSellerVehicles,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const isLoading = ref(true);
    const sellerVehicle = ref<any>(null);
    const dialogVisible = ref(false);
    const mobileSearchExpanded = ref<number[]>([]);
    const currentUser = computed(() => store.getters["auth/currentUser"]);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);

    const previewDialog = ref(false);
    const previewImageUrl = ref<string>('');
    const deleteImageDialog = ref(false);
    const imageToDelete = ref<string | null>(null);
    const deletingImageId = ref<string | null>(null);

    const loadSellerVehicle = async (id: string) => {
      try {
        isLoading.value = true;
        let result;
        if (isAdmin.value) {
          result = await store.dispatch('sellerVehicles/loadSellerVehicle', id);
        } else {
          result = await store.dispatch('sellerVehicles/loadApprovedSellerVehicle', id);
        }
        sellerVehicle.value = result;
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
        sellerVehicle.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    watch(
      () => route.params.id,
      async (newId) => {
        if (typeof newId === 'string') {
          await loadSellerVehicle(newId);
        }
      },
      { immediate: true }
    );

    const edit = (id: string) => {
      router.push({ name: 'seller-vehicles-edit', params: { id } });
    };

    const goBack = () => {
      router.push({ name: 'seller-vehicles' });
    };

    const onRemoved = () => {
      router.push({ name: 'seller-vehicles' });
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

    const openPreview = (url: string) => {
      previewImageUrl.value = url;
      previewDialog.value = true;
    };

    const confirmDeleteImage = (imageId: string) => {
      imageToDelete.value = imageId;
      deleteImageDialog.value = true;
    };

    const executeDeleteImage = async () => {
      if (!sellerVehicle.value || !imageToDelete.value) return;

      try {
        deletingImageId.value = imageToDelete.value;
        await sellerVehicleImageService.deleteImage(sellerVehicle.value.id, imageToDelete.value);
        await loadSellerVehicle(sellerVehicle.value.id);
        store.dispatch('notificator/success', 'image-deleted-successfully');
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        deleteImageDialog.value = false;
        imageToDelete.value = null;
        deletingImageId.value = null;
      }
    };

    const openWhatsApp = (phone: string, brandName: string, modelName: string) => {
      // Remove any non-numeric characters from phone
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Create the WhatsApp message
      const message = encodeURIComponent(
        `Hola, estoy interesado en la ${brandName} ${modelName} que publicaste en Motos Usadas. ¿Podrías darme más información?`
      );
      
      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    };

    return {
      isLoading,
      sellerVehicle,
      dialogVisible,
      edit,
      goBack,
      onRemoved,
      formatPrice,
      formatNumber,
      getStatusColor,
      getStatusText,
      isAdmin,
      mobileSearchExpanded,
      previewDialog,
      previewImageUrl,
      openPreview,
      deleteImageDialog,
      confirmDeleteImage,
      executeDeleteImage,
      deletingImageId,
      openWhatsApp,
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

.whatsapp-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  padding: 2px 8px;
  min-width: 0;
  height: 28px;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}

.whatsapp-label {
  font-size: 13px;
  vertical-align: middle;
}
</style>
