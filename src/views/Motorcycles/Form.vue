<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("motorcycles-.details") }}</h2>
        <p>{{ $t("motorcycles-.details-sub-heading") }}</p>
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

      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" :md="motorcycle ? '8' : ''">
            <v-row>
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("motorcycles-.data") }}</h4>
                <p class="mb-5">{{ $t("motorcycles-.basic-information-text") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.name" name="name" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('motorcycle-name')" />
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
                <Field v-model.number="request.operation" name="operation" rules="required"
                  v-slot="{ field, errors, value }">
                  <v-select v-bind="field" :model-value="value" variant="outlined" :label="$t('operation-type')"
                    :error-messages="errors" :items="operationTypes" item-text="title" item-value="value">
                  </v-select>
                </Field>
              </v-col>
              <v-col cols="12" class="py-0" v-if="isAdmin">
                <Field v-model="request.userId" name="userId" rules="required" v-slot="{ field, errors, value }">
                  <v-select
                    v-bind="field"
                    :model-value="value"
                    :items="agencyUsers"
                    item-title="fullName"
                    item-value="id"
                    variant="outlined"
                    :label="$t('assigned-user')"
                    :error-messages="errors"
                  ></v-select>
                </Field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-checkbox v-if="motorcycle" v-model="request.active" :label="$t('active')" hide-details class="my-0" />
              </v-col>

              <!-- Featured Toggle (solo admins, modo edición) -->
              <v-col cols="12" class="py-0 mt-2" v-if="motorcycle && isAdmin">
                <div class="d-flex align-center">
                  <v-icon :color="motorcycle.isFeatured ? 'warning' : 'grey'" class="mr-2">mdi-star</v-icon>
                  <span class="mr-3">{{ $t('featured-motorcycle') }}</span>
                  <v-btn
                    :color="motorcycle.isFeatured ? 'warning' : 'grey'"
                    variant="outlined"
                    size="small"
                    @click="toggleFeatured"
                    :loading="togglingFeatured"
                  >
                    {{ motorcycle.isFeatured ? $t('unmark-featured') : $t('mark-featured') }}
                  </v-btn>
                </div>
              </v-col>

              <!-- Image Management Section (only for edit mode) -->
              <v-col cols="12" class="py-0 mt-4" v-if="motorcycle">
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
                  @click.prevent="$router.push({ name: 'motorcycles' })">
                  {{ $t("discard") }}
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn color="primary" type="submit" :disabled="!meta.valid" elevation="0" block>
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
import searchMotorcycles from "./Search.vue";
import { useRoute, useRouter } from 'vue-router';
import Roles from "@/constants/Roles";

interface Motorcycle {
  id: string;
  name: string;
  brandId: string;
  modelId: string;
  typeId: string;
  locationId: string;
  userId: string;
  year: number;
  price: number;
  cubicCapacity: number;
  kms: number;
  operation: number;
  active: boolean;
  isFeatured: boolean;
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
  if (value === null || value === undefined) {
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
    searchMotorcycles,
  },

  setup() {
    const isLoading = ref<boolean>(true);
    const store = useStore();
    const currentUser = computed(() => store.getters["auth/currentUser"]);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);
    const mobileSearchExpanded = ref<number[]>([]);
    
    const request = ref({
      name: '',
      brandId: '',
      modelId: '',
      typeId: '',
      locationId: '',
      userId: currentUser.value?.id || '',
      year: new Date().getFullYear(),
      price: 0,
      cubicCapacity: 0,
      kms: 0,
      operation: 0,
      active: true,
    });

    const motorcycle = ref<Motorcycle | null>(null);
    const route = useRoute();
    const router = useRouter();
    const togglingFeatured = ref(false);
    
    const operationTypes = ref([
      { value: 0, title: i18n.global.t('operation.sale') },
      { value: 1, title: i18n.global.t('operation.rent') },
      { value: 2, title: i18n.global.t('operation.both') },
    ]);

    const brands = computed(() => store.state.brands.brands || []);
    const models = computed(() => store.state.models.models || []);
    const types = computed(() => store.state.types.types || []);
    const locations = computed(() => store.state.locations.locations || []);
    const agencyUsers = computed(() => {
      const users = store.state.users.users || [];
      return users.filter((u: any) => u.authLevel === Roles.Agency);
    });

    const filteredModels = computed(() => {
      if (!request.value.brandId) return [];
      return models.value.filter((m: any) => m.brandId === request.value.brandId);
    });

    const onBrandChange = (brandId: string) => {
      request.value.brandId = brandId;
      request.value.modelId = '';
    };

    watch(() => route.params.id, async (newId: string | string[]) => {
      isLoading.value = true;
      if (typeof newId === 'string') {
        try {
          const fetchedMotorcycle = await store.dispatch('motorcycles/loadMotorcycle', newId);
          if (fetchedMotorcycle) {
            motorcycle.value = fetchedMotorcycle;
          } else {
            motorcycle.value = null;
          }
        } catch (error) {
          motorcycle.value = null;
        }
      }
      isLoading.value = false;
    }, { immediate: true });

    watch(motorcycle, (newValue) => {
      if (newValue) {
        request.value.name = newValue.name;
        request.value.brandId = newValue.brandId;
        request.value.modelId = newValue.modelId;
        request.value.typeId = newValue.typeId;
        request.value.locationId = newValue.locationId;
        request.value.userId = newValue.userId;
        request.value.year = newValue.year;
        request.value.price = newValue.price;
        request.value.cubicCapacity = newValue.cubicCapacity;
        request.value.kms = newValue.kms;
        request.value.operation = newValue.operation;
        request.value.active = newValue.active;
      }
    }, { immediate: true });

    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch('brands/loadBrands', {}),
          store.dispatch('models/loadModels', {}),
          store.dispatch('types/loadTypes', {}),
          store.dispatch('locations/loadLocations', {}),
        ]);
        
        if (isAdmin.value) {
          await store.dispatch('users/loadUsers', { authLevel: Roles.Agency });
        }
      } catch (e) {
        console.error('Error loading form data:', e);
      }
    });

    const submitForm = async () => {
      try {
        let response: any;
        if (motorcycle.value) {
          const updateData = {
            name: request.value.name,
            brandId: request.value.brandId,
            modelId: request.value.modelId,
            typeId: request.value.typeId,
            locationId: request.value.locationId,
            userId: request.value.userId,
            year: request.value.year,
            price: request.value.price,
            cubicCapacity: request.value.cubicCapacity,
            kms: request.value.kms,
            operation: request.value.operation,
            active: request.value.active,
          };

          try {
            response = await store.dispatch('motorcycles/updateMotorcycle', {
              id: motorcycle.value.id,
              data: updateData
            });
            router.push({ name: 'motorcycles-details', params: { id: motorcycle.value.id } });
          } catch (error: any) {
            await store.dispatch('notificator/errorResponse', error);
            return;
          }
        } else {
          const createData = {
            name: request.value.name,
            brandId: request.value.brandId,
            modelId: request.value.modelId,
            typeId: request.value.typeId,
            locationId: request.value.locationId,
            userId: request.value.userId,
            year: request.value.year,
            price: request.value.price,
            cubicCapacity: request.value.cubicCapacity,
            kms: request.value.kms,
            operation: request.value.operation,
          };

          response = await store.dispatch('motorcycles/createMotorcycle', createData);
          router.push({ name: 'motorcycles-details', params: { id: response.id } });
        }
        
        if (response) {
          store.dispatch('notificator/success', 'succeeded_operation');
        }
      } catch (error: any) {
        await store.dispatch('notificator/errorResponse', error);
      }
    };

    const goToDetails = () => {
      if (motorcycle.value) {
        router.push({ name: 'motorcycles-details', params: { id: motorcycle.value.id } });
      }
    };

    const toggleFeatured = async () => {
      if (!motorcycle.value) return;
      
      try {
        togglingFeatured.value = true;
        const newFeaturedStatus = !motorcycle.value.isFeatured;
        
        await store.dispatch('motorcycles/toggleFeatured', {
          id: motorcycle.value.id,
          isFeatured: newFeaturedStatus
        });
        
        // Reload the motorcycle to get updated data
        const updatedMotorcycle = await store.dispatch('motorcycles/loadMotorcycle', motorcycle.value.id);
        if (updatedMotorcycle) {
          motorcycle.value = updatedMotorcycle;
        }
        
        store.dispatch('notificator/success', 'succeeded_operation');
      } catch (error) {
        await store.dispatch('notificator/errorResponse', error);
      } finally {
        togglingFeatured.value = false;
      }
    };

    return {
      request,
      submitForm,
      motorcycle,
      operationTypes,
      brands,
      models,
      types,
      locations,
      agencyUsers,
      filteredModels,
      onBrandChange,
      isLoading,
      isAdmin,
      validateYear,
      validatePrice,
      validateCubicCapacity,
      validateKms,
      mobileSearchExpanded,
      goToDetails,
      toggleFeatured,
      togglingFeatured,
    };
  },
}
</script>

<style lang="scss" scoped>
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

.v-form {
  max-width: 800px;
}
</style>
