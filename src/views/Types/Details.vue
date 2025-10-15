<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="goBack" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h2>{{ $t("types-.details") }}</h2>
            <p>{{ $t("types-.details-sub-heading") }}</p>
          </div>
        </div>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>

    <SplitContent v-if="!isLoading" :hide-auxiliar="!location">
      <template #auxiliar>
        <search-types />
      </template>

      <v-container fluid>
        <v-row v-if="location">
          <v-col>
            <h4 class="fg-primary">{{ $t("location") }}</h4>
            <attribute>
              <template #name>{{ $t("name") }}</template>
              {{ location.name }}
            </attribute>
          </v-col>
          <v-col cols="6" class="svg-buttons small-buttons text-right">
            <v-btn small text class="fg-blue" @click="location && edit(location.id)">
              <v-icon small>mdi-pencil</v-icon>
              {{ $t("edit") }}
            </v-btn>
            <v-btn small text class="fg-red" @click="dialogVisible = true">
              <v-icon small>mdi-delete</v-icon>
              {{ $t("delete") }}
            </v-btn>
          </v-col>
        </v-row>

        <RemoveDialog :item="location" :show="dialogVisible" @removed="onRemoved" @update:show="dialogVisible = $event" />
      </v-container>
    </SplitContent>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Heading from '@/views/components/Heading.vue';
import SplitContent from '@/views/components/SplitView.vue';
import searchTypes from './Search.vue';
import { useRouter, useRoute } from 'vue-router';
import typesService from '@/services/typesService';
import { Type } from '@/types/admin';
import Attribute from '@/views/components/Attribute.vue';
import RemoveDialog from './RemoveDialog.vue';

export default {
  components: {
    Heading,
    SplitContent,
    searchTypes,
    Attribute,
    RemoveDialog,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const location = ref<Type | null>(null);
    const isLoading = ref(true);
    const dialogVisible = ref(false);

    const loadType = async (id: string) => {
      try {
        isLoading.value = true;
        const data = await typesService.getTypeById(id);
        location.value = data;
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        isLoading.value = false;
      }
    };

    watch(
      () => route.params.id,
      (newId) => {
        if (newId && typeof newId === 'string') {
          loadType(newId);
        }
      },
      { immediate: true }
    );

    const edit = (id: string) => {
      router.push({ name: 'types-edit', params: { id } });
    };

    const goBack = () => {
      router.push({ name: 'types' });
    };

    const onRemoved = () => {
      router.push({ name: 'types' });
    };

    return {
      location,
      isLoading,
      dialogVisible,
      edit,
      goBack,
      onRemoved,
    };
  },
};
</script>

<style scoped>
.fg-primary {
  color: #1976d2;
}

.fg-blue {
  color: #2196f3;
}

.fg-red {
  color: #f44336;
}

.svg-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.small-buttons .v-btn {
  font-size: 14px;
}
</style>
