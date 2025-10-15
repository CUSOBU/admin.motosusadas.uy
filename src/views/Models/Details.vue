<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="goBack" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h2>{{ $t("models-.details") }}</h2>
            <p>{{ $t("models-.details-sub-heading") }}</p>
          </div>
        </div>
      </template>
      <template #actions>&nbsp; </template>
    </Heading>

    <SplitContent v-if="!isLoading" :hide-auxiliar="!model">
      <template #auxiliar>
        <search-models />
      </template>

      <v-container fluid>
        <v-row v-if="model">
          <v-col>
            <h4 class="fg-primary">{{ $t("model") }}</h4>
            <attribute>
              <template #name>{{ $t("name") }}</template>
              {{ model.name }}
            </attribute>
            <attribute>
              <template #name>{{ $t("brand") }}</template>
              {{ model.brand?.name || '-' }}
            </attribute>
          </v-col>
          <v-col cols="6" class="svg-buttons small-buttons text-right">
            <v-btn small text class="fg-blue" @click="model && edit(model.id)">
              <v-icon small>mdi-pencil</v-icon>
              {{ $t("edit") }}
            </v-btn>
            <v-btn small text class="fg-red" @click="dialogVisible = true">
              <v-icon small>mdi-delete</v-icon>
              {{ $t("delete") }}
            </v-btn>
          </v-col>
        </v-row>

        <RemoveDialog :item="model" :show="dialogVisible" @removed="onRemoved" @update:show="dialogVisible = $event" />
      </v-container>
    </SplitContent>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Heading from '@/views/components/Heading.vue';
import SplitContent from '@/views/components/SplitView.vue';
import searchModels from './Search.vue';
import { useRouter, useRoute } from 'vue-router';
import modelsService from '@/services/modelsService';
import { Model } from '@/types/admin';
import Attribute from '@/views/components/Attribute.vue';
import RemoveDialog from './RemoveDialog.vue';

export default {
  components: {
    Heading,
    SplitContent,
    searchModels,
    Attribute,
    RemoveDialog,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const model = ref<Model | null>(null);
    const isLoading = ref(true);
    const dialogVisible = ref(false);

    const loadModel = async (id: string) => {
      try {
        isLoading.value = true;
        const data = await modelsService.getModelById(id);
        model.value = data;
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
          loadModel(newId);
        }
      },
      { immediate: true }
    );

    const edit = (id: string) => {
      router.push({ name: 'models-edit', params: { id } });
    };

    const goBack = () => {
      router.push({ name: 'models' });
    };

    const onRemoved = () => {
      router.push({ name: 'models' });
    };

    return {
      model,
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
