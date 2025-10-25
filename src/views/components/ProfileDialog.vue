<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <div class="d-flex align-center cursor-pointer" v-bind="props">
        <v-avatar color="primary" size="40">
          <span class="text-white">{{ initials }}</span>
        </v-avatar>
        <div class="ml-3">
          <div class="text-subtitle-2 text-dark">{{ displayName }}</div>
          <div class="text-caption text-grey">{{ displayEmail }}</div>
        </div>
      </div>
    </template>
    <v-card color="white" class="profile-card">
      <v-card-title class="text-h5">
        {{ $t('profile') }}
        <v-btn icon text="true" elevation="0" class="clear-button" @click="dialog = false">
          <v-icon max-width="20px">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="d-flex flex-column align-center mb-4">
          <v-avatar color="primary" size="80" class="mb-3">
            <span class="text-h4 text-white">{{ initials }}</span>
          </v-avatar>
          <h3>{{ displayName }}</h3>
          <p class="text-grey">{{ displayEmail }}</p>
          <v-divider class="my-4 w-100"></v-divider>
          <div class="w-100">
            <div class="d-flex justify-space-between mb-2" v-if="currentUser?.active !== undefined">
              <span class="text-grey-darken-1">{{ $t('status') }}:</span>
              <v-chip :color="currentUser.active ? 'success' : 'error'" size="small">
                {{ currentUser.active ? $t('active') : $t('inactive') }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between mb-2" v-if="currentUser?.lastLoginAt">
              <span class="text-grey-darken-1">{{ $t('last-login') }}:</span>
              <span class="font-weight-medium">{{ formatDate(currentUser.lastLoginAt) }}</span>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" variant="tonal" @click="doLogout" aria-label="logout">
          <v-icon left small>mdi-logout</v-icon>
          {{ $t('logout') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();
    const dialog = ref(false);
  const router = useRouter();

    const currentUser = computed(() => store.getters['auth/currentUser']);
  const displayName = computed(() => currentUser.value?.fullName || 'Usuario');
  const displayEmail = computed(() => currentUser.value?.email || 'usuario@ejemplo.com');
  const displayAgency = computed(() => currentUser.value?.agencyName || '');
    
    const initials = computed(() => {
      const name = displayName.value;
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    });


    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleString('es-UY', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    };

    const doLogout = async () => {
      try {
        await store.dispatch('auth/logout', router);
      } catch (e) {
        // ignore
      } finally {
        dialog.value = false;
      }
    };

    return {
      dialog,
      currentUser,
      displayName,
      displayEmail,
      displayAgency,
      initials,
      formatDate,
      doLogout
    };
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.clear-button {
  position: absolute;
  border: 0cap !important;
  top: 12px;
  right: 16px;
  background-color: transparent;
}

.profile-card {
  box-shadow: 0px 40px 80px rgba(0, 0, 0, 0.04);
  border-radius: 24px !important;
  padding: 20px 32px;
}

.profile-card .v-card__title {
  color: #000000;
  font-weight: 700;
  font-size: 20px;
  line-height: 120%;
  padding-bottom: 8px;
}

.profile-card .v-card__text {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #1a1a1a;
}
</style>
