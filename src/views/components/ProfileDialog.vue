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
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('profile') }}
      </v-card-title>
      <v-card-text>
        <div class="d-flex flex-column align-center mb-4">
          <v-avatar color="primary" size="80" class="mb-3">
            <span class="text-h4 text-white">{{ initials }}</span>
          </v-avatar>
          <h3>{{ displayName }}</h3>
          <p class="text-grey">{{ displayEmail }}</p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="dialog = false">
          {{ $t('close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  props: {
    user: {
      type: Object,
      default: () => ({
        name: 'Usuario',
        email: 'usuario@ejemplo.com'
      })
    }
  },
  setup(props) {
    const dialog = ref(false);

    const displayName = computed(() => props.user?.name || 'Usuario');
    const displayEmail = computed(() => props.user?.email || 'usuario@ejemplo.com');
    
    const initials = computed(() => {
      const name = displayName.value;
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    });

    return {
      dialog,
      displayName,
      displayEmail,
      initials
    };
  }
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
