<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <h2>{{ $t("users-.details") }}</h2>
        <p>{{ $t("users-.details-sub-heading") }}</p>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>
    <SplitContent v-if="!isLoading" :hide-auxiliar="!user">
      <template #auxiliar>
        <search-users />
      </template>

      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row justify="center">
          <v-col cols="12" :md="user ? '8' : ''">
            <v-row>
              <v-col cols="12" class="py-0">
                <h4 class="mt-7">{{ $t("users-.data") }}</h4>
                <p class="mb-5">{{ $t("users-.personal-information-text") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.name" name="name" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('name')" />
                </Field>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.phoneNumber" name="phoneNumber" :rules="validatePhoneNumber"
                  v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('phoneNumber')" />
                </Field>
              </v-col>
              <v-col cols="12" class="py-0">
                <h4 class="">{{ $t("system-account") }}</h4>
                <p class="mb-5">{{ $t("users-.config-credentials") }}</p>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.email" name="email" :rules="validateEmail" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('email')" />
                </Field>
              </v-col>
              <v-col v-if="!user" cols="12" class="py-0">
                <Field v-model="request.password" name="password" rules="required" v-slot="{ field, errors, value }">
                  <v-text-field v-bind="field" :model-value="value" variant="outlined" :error-messages="errors"
                    :label="$t('password')" type="password" />
                </Field>
              </v-col>
              <v-col cols="12" class="py-0">
                <Field v-model="request.accessLevel" name="access-level" rules="required"
                  v-slot="{ field, errors, value }">
                    <v-select v-bind="field" :model-value="value" variant="outlined" :label="$t('access-level')"
                      :error-messages="errors" :items="accessLevels" item-text="title" item-value="value">
                  </v-select>
                </Field>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-checkbox v-if="user" v-model="request.active" :label="$t('active')" hide-details class="my-0" />
              </v-col>
              <v-col cols="6">
                <v-btn elevation="0" variant="outlined" color="red" block
                  @click.prevent="$router.push({ name: 'users' })">
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
import searchUsers from "./Search.vue";
import { useRoute, useRouter } from 'vue-router';
import userService from '@/services/userService';

interface User {
  id: string;
  fullName: string;
  email: string;
  active: true | false;
  accessLevel: string;
  phoneNumber: string;
}

const validatePhoneNumber = (value: string) => {
  if (!value) {
    return i18n.global.t('phone-required');
  }
  const phoneRegex = /^\+\d{10,15}$/;
  if (!phoneRegex.test(value)) {
    return i18n.global.t('phone-invalid');
  }
  return true;
};

export default {
  components: {
    Heading,
    SplitContent,
    searchUsers,
  },

  setup() {
    const isLoading = ref<boolean>(true);
    const store = useStore();
    const request = ref({
      name: '',
      email: '',
      phoneNumber: '',
      active: true,
      accessLevel: 1,
      password: '',
    });

    const user = ref<User | null>(null);
    const route = useRoute();
    const router = useRouter();
    const accessLevels = ref([
      { value: 1, title: i18n.global.t('roles.agency') },
      { value: 2, title: i18n.global.t('roles.admin') },
    ]);
    const originalUser = ref<User | null>(null);

    watch(() => route.params.id, async (newId: string | string[]) => {
      store.dispatch('SET_LOADING', true);
      if (typeof newId === 'string') {
        const fetchedUser = await userService.getUserById(newId);
        if (fetchedUser !== undefined) {
          user.value = {
            id: fetchedUser.id,
            fullName: fetchedUser.fullName,
            email: fetchedUser.email,
            accessLevel: String(fetchedUser.authLevel),
            active: fetchedUser.active,
            phoneNumber: fetchedUser.phoneNumber || '',
          } as User;
          originalUser.value = { ...user.value };
        } else {
          user.value = null;
        }
      }
      store.dispatch('SET_LOADING', false);
      isLoading.value = false;
    }
      , { immediate: true });

    watch(user, (newValue) => {
      if (newValue) {
        request.value.name = newValue.fullName;
        request.value.email = newValue.email;
        request.value.active = newValue.active;
        request.value.accessLevel = Number(newValue.accessLevel) || 1;
        request.value.phoneNumber = newValue.phoneNumber || '';

      }
    }, { immediate: true });

    const submitForm = async () => {
      try {
        let response: any;
        if (user.value) {
          const updatedFields: any = {};
          if (request.value.name !== user.value.fullName) {
            updatedFields.fullName = request.value.name;
          }
          if (request.value.email !== user.value.email) {
            updatedFields.email = request.value.email;
          }
          if (request.value.phoneNumber !== user.value.phoneNumber) {
            updatedFields.phoneNumber = request.value.phoneNumber;
          }
          if (request.value.active !== user.value.active) {
            updatedFields.active = request.value.active;
          }
          if (Number(request.value.accessLevel) !== Number(user.value.accessLevel)) {
            updatedFields.authLevel = Number(request.value.accessLevel);
          }

          try {
            response = await store.dispatch('users/updateUser', { userId: user.value.id, data: updatedFields });
            router.push({ name: 'users-details', params: { id: user.value.id } });
          } catch (error: any) {
            await store.dispatch('notificator/errorResponse', error);
            return;
          }
        } else {
          const createData = {
            fullName: request.value.name,
            email: request.value.email,
            phoneNumber: request.value.phoneNumber,
            password: request.value.password || 'DefaultPassword123!',
            authLevel: Number(request.value.accessLevel),
            operation: 0,
            agencyId: null,
          };

          response = await store.dispatch('users/createUser', createData);

          router.push({ name: 'users-details', params: { id: response.id } });
        }
        if (response) {
          store.dispatch('notificator/success', 'succeeded_operation');
        }
      } catch (error: any) {
        await store.dispatch('notificator/errorResponse', error);
      }
    };

    const validateEmail = (value: string) => {
      if (!value) {
        return i18n.global.t('email-required');
      }
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

      if (!emailRegex.test(value)) {
        return i18n.global.t('email-invalid');
      }
      return true;
    };

    return {
      request,
      submitForm,
      user,
      accessLevels,
      isLoading,
      validateEmail,
      validatePhoneNumber,
    };
  },
}
</script>

<style lang="scss" scoped>
.v-form {
  max-width: 450px;
}
</style>
