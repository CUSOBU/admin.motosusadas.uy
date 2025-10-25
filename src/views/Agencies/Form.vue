<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
  <h2>{{ agency ? $t("edit-agency") : $t("new-agency") }}</h2>
  <p>{{ $t("agencies-.details-sub-heading") }}</p>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>
  <SplitContent v-show="!isLoading" :hide-auxiliar="!agency">
      <template #auxiliar>
        <search-agencies />
      </template>

      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" :md="location ? '8' : ''">
            <v-row>
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("agencies-.data") }}</h4>
                <p class="mb-5">{{ $t("agencies-.information-text") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.name" name="name" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('name')" />
                </Field>
              </v-col>
              <v-col cols="6">
                <v-btn elevation="0" variant="outlined" color="red" block
                  @click.prevent="$router.push({ name: 'agencies' })">
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
import searchAgencies from "./Search.vue";
import { useRoute, useRouter } from 'vue-router';
import agenciesService from '@/services/agenciesService';

interface Agency {
  id: string;
  name: string;
}

export default {
  components: {
    Heading,
    SplitContent,
    searchAgencies,
  },

  setup() {
    const isLoading = ref<boolean>(true);
    const store = useStore();

    const request = ref({
      name: '',
    });
    const agency = ref<Agency | null>(null);
    const route = useRoute();
    const router = useRouter();

    watch(() => route.params.id, async (newId: string | string[]) => {
      store.dispatch('SET_LOADING', true);
      if (typeof newId === 'string') {
        const fetchedAgency = await agenciesService.getAgencyById(newId);
        if (fetchedAgency !== undefined) {
          agency.value = {
            id: fetchedAgency.id,
            name: fetchedAgency.name,
          };
          request.value = {
            name: fetchedAgency.name,
          };
        }
      } else {
        agency.value = null;
        request.value = {
          name: '',
        };
      }
      isLoading.value = false;
      store.dispatch('SET_LOADING', false);
    }, { immediate: true });

    const submitForm = async () => {
      try {
        if (agency.value) {
          await store.dispatch('agencies/updateAgency', {
            agencyId: agency.value.id,
            data: request.value
          });
          await store.dispatch('notificator/success', 'agency-updated-success');
        } else {
          await store.dispatch('agencies/createAgency', request.value);
          await store.dispatch('notificator/success', 'agency-created-success');
        }
        router.push({ name: 'agencies' });
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
