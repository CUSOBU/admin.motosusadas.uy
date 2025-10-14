<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ model ? $t("edit-model") : $t("new-model") }}</h2>
        <p>{{ $t("models-.details-sub-heading") }}</p>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>
    <SplitContent v-if="!isLoading" :hide-auxiliar="!model">
      <template #auxiliar>
        <search-models />
      </template>

      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" :md="model ? '8' : ''">
            <v-row>
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("models-.data") }}</h4>
                <p class="mb-5">{{ $t("models-.information-text") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.name" name="name" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('name')" />
                </Field>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.brandId" name="brandId" rules="required" v-slot="{ field, errors, value }">
                  <v-select v-bind="field" :model-value="value" variant="outlined" :label="$t('brand')"
                    :error-messages="errors" :items="brands" item-title="name" item-value="id">
                  </v-select>
                </Field>
              </v-col>
              <v-col cols="6">
                <v-btn elevation="0" variant="outlined" color="red" block
                  @click.prevent="$router.push({ name: 'models' })">
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
import { ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import i18n from '@/plugins/i18n';
import Heading from "@/views/components/Heading.vue";
import SplitContent from "@/views/components/SplitView.vue";
import searchModels from "./Search.vue";
import { useRoute, useRouter } from 'vue-router';
import modelsService from '@/services/modelsService';

interface Model {
  id: string;
  name: string;
  brandId: string;
}

export default {
  components: {
    Heading,
    SplitContent,
    searchModels,
  },

  setup() {
    const isLoading = ref<boolean>(true);
    const store = useStore();

    const request = ref({
      name: '',
      brandId: '',
    });

    const model = ref<Model | null>(null);
    const route = useRoute();
    const router = useRouter();
    const brands = ref([]);

    const loadBrands = async () => {
      try {
        await store.dispatch('brands/loadBrands');
        brands.value = store.state.brands.brands;
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    onMounted(async () => {
      await loadBrands();
    });

    watch(() => route.params.id, async (newId: string | string[]) => {
      store.dispatch('SET_LOADING', true);
      if (typeof newId === 'string') {
        const fetchedModel = await modelsService.getModelById(newId);
        if (fetchedModel !== undefined) {
          model.value = {
            id: fetchedModel.id,
            name: fetchedModel.name,
            brandId: fetchedModel.brandId,
          };
          request.value = {
            name: fetchedModel.name,
            brandId: fetchedModel.brandId,
          };
        }
      } else {
        model.value = null;
        request.value = {
          name: '',
          brandId: '',
        };
      }
      isLoading.value = false;
      store.dispatch('SET_LOADING', false);
    }, { immediate: true });

    const submitForm = async () => {
      try {
        if (model.value) {
          await store.dispatch('models/updateModel', {
            modelId: model.value.id,
            data: request.value
          });
          await store.dispatch('notificator/success', 'model-updated-success');
        } else {
          await store.dispatch('models/createModel', request.value);
          await store.dispatch('notificator/success', 'model-created-success');
        }
        router.push({ name: 'models' });
      } catch (error) {
        await store.dispatch('notificator/errorResponse', error);
      }
    };

    return {
      request,
      model,
      submitForm,
      isLoading,
      brands,
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
