<template>
  <v-overlay :model-value="loading" class="d-flex align-center justify-center">
    <v-progress-circular indeterminate color="primary" />
  </v-overlay>
  <v-container fluid class="py-0">
    <heading/>
    <v-row class="mt-5">
      <v-col>
        <v-chip variant="outlined" :color="`${active === 'all' ? 'primary' : ''}`" class="text-lowercase cursor-pointer"
          @click="active = 'all'">
          {{ $t("all") }}
        </v-chip>
        <v-chip variant="outlined" :color="`${active === 'last-week' ? 'primary' : ''}`"
          class="ml-1 text-lowercase cursor-pointer" @click="active = 'last-week'">
          {{ $t("past-week") }}
        </v-chip>
        <v-chip variant="outlined" :color="`${active === 'this-month' ? 'primary' : ''}`"
          class="ml-1 text-lowercase cursor-pointer" @click="active = 'this-month'">
          {{ $t("this-month") }}
        </v-chip>
        <v-chip variant="outlined" :color="`${active === 'last-month' ? 'primary' : ''}`"
          class="ml-1 text-lowercase cursor-pointer" @click="active = 'last-month'">
          {{ $t("last-month") }}
        </v-chip>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12" class="big-chips">
        <big-chip type="success" :number="counters.completed" :description="$t('completed-sales')" />
        <big-chip type="warning" :number="counters.pending" :description="$t('pending-sales')" />
        <big-chip type="danger" :number="counters.profits" money :description="$t('profits')" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, watch, onMounted } from 'vue'
import * as dayjs from "dayjs";
import BigChip from "./components/BigChip.vue";
import Heading from "./components/Heading.vue";

interface Counters {
  completed: undefined | number;
  pending: undefined | number;
  profits: undefined | number;
}

interface Filters {
  from?: string;
  to?: string;
}

export default {  
  components: {
    Heading,
    BigChip,
  },

  setup() {
    const counters  = ref<Counters>({
      completed: 150,
      pending: 25,
      profits: 45000,
    });
    const active = ref("all");
    const loading = ref(false)

    const fetchCounters = async (value: string) => {
      loading.value = true;
      const filters: Filters = {};
      if (value == "this-month") {
        filters.from = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ssZ");
        filters.to = dayjs().endOf("month").format("YYYY-MM-DDTHH:mm:ssZ");
      }
      else if (value == "last-month") {
        const pivot = dayjs().subtract(1, 'month')
        filters.from = pivot.startOf("month").format("YYYY-MM-DDTHH:mm:ssZ");
        filters.to = pivot.endOf("month").format("YYYY-MM-DDTHH:mm:ssZ");
      }
      else if (value == "last-week") {
        filters.from = dayjs().startOf("week").format("YYYY-MM-DDTHH:mm:ssZ");
        filters.to = dayjs().endOf("week").format("YYYY-MM-DDTHH:mm:ssZ");
      }
      
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    };

    watch(active, fetchCounters);

    onMounted(() => {
      fetchCounters(active.value);
    });

    return {
      counters,
      active,
      loading,
      fetchCounters,
    };
  },
};
</script>

<style scoped lang="scss">
.v-container {
  .big-chips {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;

    >div {
      flex: 1;
      min-width: 200px;
      width: 30%;
    }
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
