<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
  <h2>{{ typeEntity ? $t("edit-type") : $t("new-type") }}</h2>
  <p>{{ $t("types-.details-sub-heading") }}</p>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>
  <SplitContent v-if="!isLoading" :hide-auxiliar="!typeEntity">
      <template #auxiliar>
        <search-types />
      </template>

      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" :md="location ? '8' : ''">
            <v-row>
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("types-.data") }}</h4>
                <p class="mb-5">{{ $t("types-.information-text") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.name" name="name" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('name')" />
                </Field>
              </v-col>
              <v-col cols="6">
                <v-btn elevation="0" variant="outlined" color="red" block
                  @click.prevent="$router.push({ name: 'types' })">
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
import searchTypes from "./Search.vue";
import { useRoute, useRouter } from 'vue-router';
import typesService from '@/services/typesService';

interface Type {
  id: string;
  name: string;
}

export default {
  components: {
    Heading,
    SplitContent,
    searchTypes,
  },

  setup() {
    const isLoading = ref<boolean>(true);
    const store = useStore();

    const request = ref({
      name: '',
    });

    const typeEntity = ref<Type | null>(null);
    const route = useRoute();
    const router = useRouter();

    watch(() => route.params.id, async (newId: string | string[]) => {
      store.dispatch('SET_LOADING', true);
      if (typeof newId === 'string') {
        const fetchedType = await typesService.getTypeById(newId);
        if (fetchedType !== undefined) {
          typeEntity.value = {
            id: fetchedType.id,
            name: fetchedType.name,
          };
          request.value = {
            name: fetchedType.name,
          };
        }
      } else {
        typeEntity.value = null;
        request.value = {
          name: '',
        };
      }
      isLoading.value = false;
      store.dispatch('SET_LOADING', false);
    }, { immediate: true });

    const submitForm = async () => {
      try {
        if (typeEntity.value) {
          await store.dispatch('types/updateType', {
            typeId: typeEntity.value.id,
            data: request.value
          });
          await store.dispatch('notificator/success', 'type-updated-success');
        } else {
          await store.dispatch('types/createType', request.value);
          await store.dispatch('notificator/success', 'type-created-success');
        }
        router.push({ name: 'types' });
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
