<template>
  <v-container>
    <div class="login">
      <h1>{{ $t("welcome") }}!</h1>
      <p>{{ $t("welcome-text") }}</p>
      <Form @submit="submitForm" v-slot="{ meta, errors }">
        <v-row no-gutters>
          <v-col>
            <Field name="email" rules="required|email">
              <template #default="{ field }">
                <v-text-field color="primary" v-bind="field" v-model="email"
                  :error-messages="errors.email ? [errors.email] : []" :label="$t('email')" variant="outlined" clearable
                  type="email" prepend-inner-icon="mdi-email" />
              </template>
            </Field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <Field name="password" rules="required|min:8">
              <template #default="{ field }">
                <v-text-field color="primary" v-bind="field" v-model="password"
                  :type="showPassword ? 'text' : 'password'" :error-messages="errors.password ? [errors.password] : []"
                  :label="$t('password')" variant="outlined" clearable
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleShowPassword"
                  prepend-inner-icon="mdi-lock-outline" />
              </template>
            </Field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="text-right">
            <router-link :to="{ name: 'password-recover' }" class="router-link-password">
              {{ $t("forgot-password") }}
            </router-link>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="text-right mt-10 pt-10">
            <v-btn color="primary" type="submit" :disabled="!meta.valid || loggingIn" elevation="0" block
              :loading="loggingIn">
              {{ $t("login") }}
            </v-btn>
          </v-col>
        </v-row>
      </Form>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Field, Form, useField } from 'vee-validate';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    Form,
    Field,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const loggingIn = ref(false);

    const { value: email } = useField<string>('email');
    const { value: password } = useField<string>('password');

    const submitForm = async () => {
      loggingIn.value = true;
      try {
        await store.dispatch('auth/loginWithPassword', {
          email: email.value,
          password: password.value
        });
        router.push({ name: 'dashboard' });
      } catch (error: any) {
        const hasSpecificErrorCode =
          error?.data?.code || error?.status || error?.code || null;
        if (!hasSpecificErrorCode) {
          error.customMessage = 'error_login';
        }
        await store.dispatch('notificator/errorResponse', error);
      } finally {
        loggingIn.value = false;
      }
    };

    const showPassword = ref(false);
    const toggleShowPassword = () => {
      setTimeout(() => {
        showPassword.value = !showPassword.value;
      }, 0);
    };

    return {
      submitForm,
      loggingIn,
      email,
      password,
      showPassword,
      toggleShowPassword,
    };
  },
});
</script>

<style scoped lang="scss">
.v-container {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;

  .login {
    width: 342px;

    :deep(.v-field__append-inner) .mdi {
      cursor: pointer;
    }

    h1 {
      color: #1d3557;
      font-weight: 900;
      font-size: 39px;
      line-height: 120%;
    }

  }

}
</style>
