<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPageLocal"
    v-model:page="pageLocal"
    :headers="headers"
    :items="items"
    :items-length="totalItems"
    :loading="loading"
    :class="`elevation-0 ${headerless ? 'v-data-table-headerless' : ''}`"
    :items-per-page-options="itemsPerPageOptions"
    :hide-default-footer="hideFooter"
    @update:options="handleOptionsUpdate"
  >
    <template v-if="headerless" #headers>
      <td style="display: none;"></td>
    </template>

    <template v-for="(value, name) in $slots" v-slot:[name]="{ item }">
      <slot :name="name" :item="item"></slot>
    </template>

    <template v-slot:item.actions="{ item }">
      <slot name="item.actions" :item="item" />
    </template>
  </v-data-table-server>
</template>

<script lang="ts">
import { PropType, ref, watch, computed } from 'vue';
import type { SetupContext } from 'vue';

interface UpdateOptions {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
  sortDesc: boolean[];
}

interface Props {
  headers: any[];
  items: any[];
  headerless: boolean;
  page: number;
  itemsPerPage: number;
  totalItems: number;
  hideFooter: boolean;
}

export default {
  props: {
    headers: {
      type: Array as PropType<any[]>,
      default: (): string[] => [],
    },
    items: {
      type: Array as PropType<any[]>,
      default: (): any[] => [],
    },
    headerless: {
      type: Boolean,
      default: true,
    },
    page: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    totalItems: {
      type: Number,
      default: 10,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props, { emit }: SetupContext<['update:options']>) {
    const loading = ref(false);
    const pageLocal = ref(props.page);
    const itemsPerPageLocal = ref(props.itemsPerPage);


  const itemsPerPageOptions = computed(() => [5, 10, 15, -1]);

    const handleOptionsUpdate = (options: UpdateOptions) => {
      loading.value = true;
      emit('update:options', {
        page: options.page,
        itemsPerPage: options.itemsPerPage === -1 ? props.totalItems : options.itemsPerPage,
        sortBy: options.sortBy,
        sortDesc: options.sortDesc,
      });
      setTimeout(() => {
        loading.value = false;
      }, 100);
    };

    watch(
      () => props.items,
      () => {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
        }, 100);
      },
      { immediate: true }
    );
    watch(() => props.page, (v) => { pageLocal.value = v; });
    watch(() => props.itemsPerPage, (v) => {
      itemsPerPageLocal.value = v && v > 0 ? v : (props.totalItems || 10);
    }, { immediate: true });
    watch(() => props.totalItems, (v) => {
      if (!itemsPerPageLocal.value || itemsPerPageLocal.value < 1) {
        itemsPerPageLocal.value = v || 10;
      }
    });

    return {
      loading,
      pageLocal,
      itemsPerPageLocal,
      handleOptionsUpdate,
      itemsPerPageOptions
    };
  },
};
</script>