<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
  <h2>{{ brand ? $t("edit-brand") : $t("new-brand") }}</h2>
  <p>{{ $t("brands-.details-sub-heading") }}</p>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>
  <SplitContent v-if="!isLoading" :hide-auxiliar="!brand">
      <template #auxiliar>
        <search-brands />
      </template>

      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" :md="location ? '8' : ''">
            <v-row>
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("brands-.data") }}</h4>
                <p class="mb-5">{{ $t("brands-.information-text") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.name" name="name" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('name')" />
                </Field>
              </v-col>
              <v-col cols="6">
                <v-btn elevation="0" variant="outlined" color="red" block
                  @click.prevent="$router.push({ name: 'brands' })">
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
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import i18n from '@/plugins/i18n';
import Heading from "@/views/components/Heading.vue";
import SplitContent from "@/views/components/SplitView.vue";
import searchBrands from "./Search.vue";
import { useRoute, useRouter } from 'vue-router';
import brandsService from '@/services/brandsService';

interface Brand {
  id: string;
  name: string;
}

export default {
  components: {
    Heading,
    SplitContent,
    searchBrands,
  },

  setup() {
    const isLoading = ref<boolean>(true);
    const store = useStore();

    const request = ref({
      name: '',
    });

    const brand = ref<Brand | null>(null);
    const route = useRoute();
    const router = useRouter();

    watch(() => route.params.id, async (newId: string | string[]) => {
      store.dispatch('SET_LOADING', true);
      if (typeof newId === 'string') {
        const fetchedBrand = await brandsService.getBrandById(newId);
        if (fetchedBrand !== undefined) {
          brand.value = {
            id: fetchedBrand.id,
            name: fetchedBrand.name,
          };
          request.value = {
            name: fetchedBrand.name,
          };
        }
      } else {
        brand.value = null;
        request.value = {
          name: '',
        };
      }
      isLoading.value = false;
      store.dispatch('SET_LOADING', false);
    }, { immediate: true });

    const submitForm = async () => {
      try {
        if (brand.value) {
          await store.dispatch('brands/updateBrand', {
            brandId: brand.value.id,
            data: request.value
          });
          await store.dispatch('notificator/success', 'brand-updated-success');
        } else {
          await store.dispatch('brands/createBrand', request.value);
          await store.dispatch('notificator/success', 'brand-created-success');
        }
        router.push({ name: 'brands' });
      } catch (error) {
        await store.dispatch('notificator/errorResponse', error);
      }
    };

    return {
      request,
      location,
      submitForm,
      isLoading,
    };
  },
};
</script>

<style scoped>
.table-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}
</style>
