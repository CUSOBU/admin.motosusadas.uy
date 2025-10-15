import motorcyclesService from "@/services/motorcyclesService";
import {
  Motorcycle,
  CreateMotorcycleRequest,
  UpdateMotorcycleRequest,
  MotorcycleFilterRequest,
  MotorcycleStatsResponse,
} from "@/models/motorcycle.model";

type State = {
  motorcycles: Motorcycle[];
  currentMotorcycle: Motorcycle | null;
  total: number;
  stats: MotorcycleStatsResponse | null;
  loading: boolean;
};

const state: State = {
  motorcycles: [],
  currentMotorcycle: null,
  total: 0,
  stats: null,
  loading: false,
};

const mutations = {
  setMotorcycles(state: State, motorcycles: Motorcycle[]) {
    state.motorcycles = motorcycles;
  },
  setCurrentMotorcycle(state: State, motorcycle: Motorcycle | null) {
    state.currentMotorcycle = motorcycle;
  },
  setTotal(state: State, total: number) {
    state.total = total;
  },
  setStats(state: State, stats: MotorcycleStatsResponse) {
    state.stats = stats;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  motorcycles: (state: State) => state.motorcycles,
  currentMotorcycle: (state: State) => state.currentMotorcycle,
  total: (state: State) => state.total,
  stats: (state: State) => state.stats,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadMotorcycles(
    { commit }: { commit: any },
    filters: MotorcycleFilterRequest
  ) {
    try {
      commit("setLoading", true);
      const response = await motorcyclesService.listMotorcycles(filters);
      commit("setMotorcycles", response.data);
      commit("setTotal", response.pagination.total);
      return response;
    } catch (error) {
      commit("setMotorcycles", []);
      commit("setTotal", 0);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async loadMotorcycle({ commit }: { commit: any }, id: string) {
    try {
      commit("setLoading", true);
      const motorcycle = await motorcyclesService.getMotorcycle(id);
      commit("setCurrentMotorcycle", motorcycle);
      return motorcycle;
    } catch (error) {
      commit("setCurrentMotorcycle", null);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async createMotorcycle(
    { commit }: { commit: any },
    data: CreateMotorcycleRequest
  ) {
    try {
      commit("setLoading", true);
      const motorcycle = await motorcyclesService.createMotorcycle(data);
      return motorcycle;
    } finally {
      commit("setLoading", false);
    }
  },

  async updateMotorcycle(
    { commit }: { commit: any },
    { id, data }: { id: string; data: UpdateMotorcycleRequest }
  ) {
    try {
      commit("setLoading", true);
      const motorcycle = await motorcyclesService.updateMotorcycle(id, data);
      commit("setCurrentMotorcycle", motorcycle);
      return motorcycle;
    } finally {
      commit("setLoading", false);
    }
  },

  async deleteMotorcycle({ commit }: { commit: any }, id: string) {
    try {
      commit("setLoading", true);
      await motorcyclesService.deleteMotorcycle(id);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadStats({ commit }: { commit: any }) {
    try {
      const stats = await motorcyclesService.getStats();
      commit("setStats", stats);
      return stats;
    } catch (error) {
      commit("setStats", null);
      throw error;
    }
  },

  clearCurrentMotorcycle({ commit }: { commit: any }) {
    commit("setCurrentMotorcycle", null);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
