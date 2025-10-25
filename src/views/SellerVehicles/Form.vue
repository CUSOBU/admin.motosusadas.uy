<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("seller-vehicle-details") }}</h2>
        <p>{{ $t("seller-vehicle-details-sub-heading") }}</p>
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

      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" :md="sellerVehicle ? '8' : ''">
            <v-row>
              <!-- Seller Information (readonly) -->
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("seller-info") }}</h4>
                <p class="mb-5">{{ $t("seller-information-text") }}</p>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  :model-value="sellerVehicle.sellerName"
                  variant="outlined"
                  :label="$t('seller-name')"
                  readonly
                  disabled
                />
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-text-field
                  :model-value="sellerVehicle.sellerPhone"
                  variant="outlined"
                  :label="$t('seller-phone')"
                  readonly
                  disabled
                />
              </v-col>
              <v-col cols="12" class="py-0">
                <v-text-field
                  :model-value="sellerVehicle.sellerEmail"
                  variant="outlined"
                  :label="$t('seller-email')"
                  readonly
                  disabled
                />
              </v-col>

              <!-- Status Change Section - Right after seller info -->
              <v-col cols="12" class="py-0 mt-6" v-if="sellerVehicle && isAdmin">
                <v-divider></v-divider>
                <h4 class="mt-7">{{ $t("change-status") }}</h4>
                <p class="mb-5">{{ $t("change-status-description") }}</p>
              </v-col>
              <v-col cols="12" md="6" class="py-0" v-if="sellerVehicle && isAdmin">
                <v-select
                  v-model="statusChangeRequest.status"
                  :items="statusOptions"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  :label="$t('vehicle-status')"
                ></v-select>
              </v-col>
              <v-col cols="12" class="py-0" v-if="sellerVehicle && isAdmin">
                <v-textarea
                  v-model="statusChangeRequest.adminNotes"
                  variant="outlined"
                  :label="$t('admin-notes')"
                  rows="3"
                  :counter="1000"
                ></v-textarea>
              </v-col>
              <v-col cols="12" class="py-0" v-if="sellerVehicle && isAdmin">
                <v-btn
                  color="primary"
                  elevation="0"
                  block
                  @click="changeStatus"
                  :loading="changingStatus"
                  :disabled="statusChangeRequest.status === sellerVehicle.status"
                >
                  <v-icon left>mdi-swap-horizontal</v-icon>
                  {{ $t("change-status") }}
                </v-btn>
              </v-col>

              <v-col cols="12" class="py-0 mt-6">
                <v-divider></v-divider>
              </v-col>

              <!-- Vehicle Data -->
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("seller-vehicle-data") }}</h4>
                <p class="mb-5">{{ $t("seller-vehicle-basic-information-text") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.name" name="name" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('name')" />
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model="request.brandId" name="brandId" rules="required" v-slot="{ field, errors, value }">
                  <v-select
                    v-bind="field"
                    :model-value="value"
                    :items="brands"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    :label="$t('brand')"
                    :error-messages="errors"
                    @update:model-value="onBrandChange"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model="request.modelId" name="modelId" rules="required" v-slot="{ field, errors, value }">
                  <v-select
                    v-bind="field"
                    :model-value="value"
                    :items="filteredModels"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    :label="$t('model')"
                    :error-messages="errors"
                    :disabled="!request.brandId"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model="request.typeId" name="typeId" rules="required" v-slot="{ field, errors, value }">
                  <v-select
                    v-bind="field"
                    :model-value="value"
                    :items="types"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    :label="$t('type')"
                    :error-messages="errors"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model="request.locationId" name="locationId" rules="required" v-slot="{ field, errors, value }">
                  <v-select
                    v-bind="field"
                    :model-value="value"
                    :items="locations"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    :label="$t('location')"
                    :error-messages="errors"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model.number="request.year" name="year" :rules="validateYear" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('year')" type="number" />
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model.number="request.price" name="price" :rules="validatePrice" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('price')" type="number" />
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model.number="request.cubicCapacity" name="cubicCapacity" :rules="validateCubicCapacity"
                  v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('cubic-capacity')" type="number" suffix="cc" />
                </Field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <Field v-model.number="request.kms" name="kms" :rules="validateKms" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('kms')" type="number" />
                </Field>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.description" name="description" v-slot="{ field, errors, value }">
                  <v-textarea v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('description')" rows="4" />
                </Field>
              </v-col>

              <!-- Image Management Section -->
              <v-col cols="12" class="py-0 mt-4">
                <v-divider class="mb-4"></v-divider>
                <h4 class="mb-3">{{ $t("images") }}</h4>
                <p class="text-caption mb-3">{{ $t("manage-images-in-details") }}</p>
                <v-btn
                  variant="outlined"
                  color="primary"
                  @click="goToDetails"
                >
                  <v-icon left>mdi-image-multiple</v-icon>
                  {{ $t("go-to-image-management") }}
                </v-btn>
              </v-col>

              <v-col cols="6">
                <v-btn elevation="0" variant="outlined" color="red" block
                  @click.prevent="$router.push({ name: 'seller-vehicles' })">
                  {{ $t("discard") }}
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="primary" type="submit" elevation="0" block>
                  {{ $t("submit") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </Form>

    </SplitContent>
  </v-container>

</template>

<script lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import i18n from '@/plugins/i18n';
import Heading from "@/views/components/Heading.vue";
import SplitContent from "@/views/components/SplitView.vue";
import searchSellerVehicles from "./Search.vue";
import { useRoute, useRouter } from 'vue-router';
import Roles from "@/constants/Roles";
import { SellerVehicleStatus } from "@/models/seller-vehicle.model";

interface SellerVehicle {
  id: string;
  name: string;
  brandId: string;
  modelId: string;
  typeId: string;
  locationId: string;
  year: number;
  price: number;
  cubicCapacity: number;
  kms: number;
  description: string;
  status: SellerVehicleStatus;
  adminNotes: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
}

const validateYear = (value: number) => {
  if (!value) {
    return i18n.global.t('year-required');
  }
  const currentYear = new Date().getFullYear();
  if (value < 1900 || value > currentYear + 1) {
    return i18n.global.t('year-invalid', { min: 1900, max: currentYear + 1 });
  }
  return true;
};

const validatePrice = (value: number) => {
  if (!value) {
    return i18n.global.t('price-required');
  }
  if (value <= 0 || value > 10000000) {
    return i18n.global.t('price-invalid', { max: 10000000 });
  }
  return true;
};

const validateCubicCapacity = (value: number) => {
  if (!value) {
    return i18n.global.t('cubic-capacity-required');
  }
  if (value <= 0 || value > 5000) {
    return i18n.global.t('cubic-capacity-invalid', { max: 5000 });
  }
  return true;
};

const validateKms = (value: number) => {
  if (!value && value !== 0) {
    return i18n.global.t('kms-required');
  }
  if (value < 0 || value > 500000) {
    return i18n.global.t('kms-invalid', { max: 500000 });
  }
  return true;
};

export default {
  components: {
    Heading,
    SplitContent,
    searchSellerVehicles,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const mobileSearchExpanded = ref<number[]>([]);

    const currentUser = computed(() => store.getters["auth/currentUser"]);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);

    const sellerVehicle = ref<SellerVehicle | null>(null);
    const request = ref({
      name: '',
      brandId: '',
      modelId: '',
      typeId: '',
      locationId: '',
      year: new Date().getFullYear(),
      price: 0,
      cubicCapacity: 0,
      kms: 0,
      description: '',
      // Seller fields are required by the API for update
      sellerName: '',
      sellerPhone: '',
      sellerEmail: '',
    });

    const statusChangeRequest = ref({
      status: SellerVehicleStatus.Pending,
      adminNotes: '',
    });

    const changingStatus = ref(false);

    const brands = computed(() => store.getters['brands/brands']);
    const models = computed(() => store.getters['models/models']);
    const types = computed(() => store.getters['types/types']);
    const locations = computed(() => store.getters['locations/locations']);

    const statusOptions = ref([
      { value: SellerVehicleStatus.Pending, text: i18n.global.t('status-pending') },
      { value: SellerVehicleStatus.Approved, text: i18n.global.t('status-approved') },
      { value: SellerVehicleStatus.Rejected, text: i18n.global.t('status-rejected') },
      { value: SellerVehicleStatus.Contacted, text: i18n.global.t('status-contacted') },
    ]);

    const filteredModels = computed(() => {
      if (!request.value.brandId) return [];
      return models.value.filter((m: any) => m.brandId === request.value.brandId);
    });

    const onBrandChange = () => {
      request.value.modelId = '';
    };

    const loadData = async () => {
      try {
        isLoading.value = true;
        await Promise.all([
          store.dispatch('brands/loadBrands', {}),
          store.dispatch('models/loadModels', {}),
          store.dispatch('types/loadTypes', {}),
          store.dispatch('locations/loadLocations', {}),
        ]);

        if (route.params.id) {
          const vehicle = await store.dispatch('sellerVehicles/loadSellerVehicle', route.params.id);
          if (vehicle) {
            sellerVehicle.value = vehicle;
            request.value = {
              name: vehicle.name,
              brandId: vehicle.brandId,
              modelId: vehicle.modelId,
              typeId: vehicle.typeId,
              locationId: vehicle.locationId,
              year: vehicle.year,
              price: vehicle.price,
              cubicCapacity: vehicle.cubicCapacity,
              kms: vehicle.kms,
              description: vehicle.description || '',
              // include seller fields so the PUT payload satisfies the API contract
              sellerName: vehicle.sellerName || '',
              sellerPhone: vehicle.sellerPhone || '',
              sellerEmail: vehicle.sellerEmail || '',
            };
            statusChangeRequest.value = {
              status: vehicle.status,
              adminNotes: vehicle.adminNotes || '',
            };
          }
        }
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      await loadData();
    });

    const submitForm = async () => {
      try {
        if (route.params.id) {
          // Ensure seller fields are sent (API expects sellerName/sellerPhone/sellerEmail)
          const payload = {
            ...request.value,
            sellerName: request.value.sellerName || sellerVehicle.value?.sellerName || '',
            sellerPhone: request.value.sellerPhone || sellerVehicle.value?.sellerPhone || '',
            sellerEmail: request.value.sellerEmail || sellerVehicle.value?.sellerEmail || '',
          };

          await store.dispatch('sellerVehicles/updateSellerVehicle', {
            id: route.params.id,
            data: payload,
          });
          
          store.dispatch('notificator/success', 'seller-vehicle-updated-success');
        }
        
        router.push({ name: 'seller-vehicles' });
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    const changeStatus = async () => {
      if (!route.params.id) return;

      try {
        changingStatus.value = true;
        await store.dispatch('sellerVehicles/changeStatus', {
          id: route.params.id,
          data: {
            status: statusChangeRequest.value.status,
            adminNotes: statusChangeRequest.value.adminNotes,
          },
        });
        
        store.dispatch('notificator/success', 'status-changed-successfully');
        
        // Reload vehicle data
        await loadData();
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        changingStatus.value = false;
      }
    };

    const goToDetails = () => {
      if (route.params.id) {
        router.push({ name: 'seller-vehicles-details', params: { id: route.params.id } });
      }
    };

    return {
      isLoading,
      sellerVehicle,
      request,
      statusChangeRequest,
      changingStatus,
      brands,
      models,
      types,
      locations,
      filteredModels,
      statusOptions,
      onBrandChange,
      submitForm,
      changeStatus,
      goToDetails,
      isAdmin,
      mobileSearchExpanded,
      validateYear,
      validatePrice,
      validateCubicCapacity,
      validateKms,
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
</style>
