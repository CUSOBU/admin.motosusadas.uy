<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("contact-info-management") }}</h2>
        <p>{{ $t("contact-info-subtitle") }}</p>
      </template>
    </Heading>

    <v-container fluid>
      <Form @submit="onSubmit" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t('contact-info') }}</h4>
                <p class="mb-5">{{ $t('contact-info-subtitle') }}</p>
              </v-col>

              <v-col cols="12" class="py-0">
                <Field v-model="formData.phoneNumber" name="phoneNumber" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('phone')" prepend-inner-icon="mdi-phone" />
                </Field>
              </v-col>

              <v-col cols="12" class="py-0">
                <Field v-model="formData.location" name="location" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('address')" prepend-inner-icon="mdi-map-marker" />
                </Field>
              </v-col>

              <v-col cols="12" class="py-0">
                <Field v-model="formData.schedule" name="schedule" rules="required" v-slot="{ field, errors, value }">
                  <v-textarea v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('opening-hours')" rows="3" />
                </Field>
              </v-col>

              <v-col cols="6">
                <v-btn elevation="0" variant="outlined" color="red" block
                  @click.prevent="$router.push({ name: 'dashboard' })">
                  {{ $t('cancel') }}
                </v-btn>
              </v-col>

              <v-col cols="6">
                <v-btn color="primary" type="submit" :disabled="!meta.valid" elevation="0" block>
                  {{ $t('save') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </Form>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import Heading from "@/views/components/Heading.vue";
import { UpdateContactInfoRequest } from '@/models/contact-info.model';
import i18n from '@/plugins/i18n';

export default {
  components: {
    Heading,
  },
  setup() {
    const store = useStore();
    const form = ref<any>(null);
    const valid = ref(false);
    const isSaving = ref(false);

    const formData = ref<UpdateContactInfoRequest>({
      id: undefined,
      phoneNumber: '',
      location: '',
      schedule: '',
    });

    const contactInfo = computed(() => store.state.contactInfo.contactInfo);

    const required = (v: string) => !!v || i18n.global.t('required-field');
    const emailRule = (v: string) => /.+@.+\..+/.test(v) || i18n.global.t('email-invalid');

    const loadContactInfo = async () => {
      try {
        const data = await store.dispatch('contactInfo/loadContactInfo');
        if (data) {
          formData.value = {
            id: data.id,
            phoneNumber: data.phoneNumber || '',
            location: data.location || '',
            schedule: data.schedule || '',
          };
        }
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    const onSubmit = async () => {
      if (!valid.value) return;

      try {
        isSaving.value = true;
  await store.dispatch('contactInfo/updateContactInfo', formData.value);
        store.dispatch('notificator/success', i18n.global.t('contact-info-updated-successfully'));
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        isSaving.value = false;
      }
    };

    onMounted(() => {
      loadContactInfo();
    });

    return {
      form,
      valid,
      isSaving,
      formData,
      required,
      emailRule,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.fg-primary {
  color: var(--v-primary-base);
}
</style>
