import sellerVehiclesService from "@/services/sellerVehiclesService";
import {
  SellerVehicle,
  UpdateSellerVehicleRequest,
  SellerVehicleFilterRequest,
  ChangeStatusRequest,
} from "@/models/seller-vehicle.model";

type State = {
  sellerVehicles: SellerVehicle[];
  currentSellerVehicle: SellerVehicle | null;
  total: number;
  loading: boolean;
};

const state: State = {
  sellerVehicles: [],
  currentSellerVehicle: null,
  total: 0,
  loading: false,
};

const mutations = {
  setSellerVehicles(state: State, sellerVehicles: SellerVehicle[]) {
    state.sellerVehicles = sellerVehicles;
  },
  setCurrentSellerVehicle(state: State, sellerVehicle: SellerVehicle | null) {
    state.currentSellerVehicle = sellerVehicle;
  },
  setTotal(state: State, total: number) {
    state.total = total;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  sellerVehicles: (state: State) => state.sellerVehicles,
  currentSellerVehicle: (state: State) => state.currentSellerVehicle,
  total: (state: State) => state.total,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadApprovedSellerVehicles(
    { commit }: { commit: any },
    filters: SellerVehicleFilterRequest
  ) {
    try {
      commit("setLoading", true);
      const response = await sellerVehiclesService.listApprovedSellerVehicles(
        filters
      );
      commit("setSellerVehicles", response.data);
      commit("setTotal", response.pagination.total);
      return response;
    } catch (error) {
      commit("setSellerVehicles", []);
      commit("setTotal", 0);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async loadAllSellerVehicles(
    { commit }: { commit: any },
    filters: SellerVehicleFilterRequest
  ) {
    try {
      commit("setLoading", true);
      const response = await sellerVehiclesService.listAllSellerVehicles(
        filters
      );
      commit("setSellerVehicles", response.data);
      commit("setTotal", response.pagination.total);
      return response;
    } catch (error) {
      commit("setSellerVehicles", []);
      commit("setTotal", 0);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async loadSellerVehicle({ commit }: { commit: any }, id: string) {
    try {
      commit("setLoading", true);
      const sellerVehicle = await sellerVehiclesService.getSellerVehicle(id);
      commit("setCurrentSellerVehicle", sellerVehicle);
      return sellerVehicle;
    } catch (error) {
      commit("setCurrentSellerVehicle", null);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async loadApprovedSellerVehicle({ commit }: { commit: any }, id: string) {
    try {
      commit("setLoading", true);
      const sellerVehicle =
        await sellerVehiclesService.getApprovedSellerVehicle(id);
      commit("setCurrentSellerVehicle", sellerVehicle);
      return sellerVehicle;
    } catch (error) {
      commit("setCurrentSellerVehicle", null);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async updateSellerVehicle(
    { commit }: { commit: any },
    { id, data }: { id: string; data: UpdateSellerVehicleRequest }
  ) {
    try {
      commit("setLoading", true);
      const sellerVehicle = await sellerVehiclesService.updateSellerVehicle(
        id,
        data
      );
      commit("setCurrentSellerVehicle", sellerVehicle);
      return sellerVehicle;
    } finally {
      commit("setLoading", false);
    }
  },

  async changeStatus(
    { commit }: { commit: any },
    { id, data }: { id: string; data: ChangeStatusRequest }
  ) {
    try {
      commit("setLoading", true);
      const sellerVehicle = await sellerVehiclesService.changeStatus(id, data);
      commit("setCurrentSellerVehicle", sellerVehicle);
      return sellerVehicle;
    } finally {
      commit("setLoading", false);
    }
  },

  async deleteSellerVehicle({ commit }: { commit: any }, id: string) {
    try {
      commit("setLoading", true);
      await sellerVehiclesService.deleteSellerVehicle(id);
    } finally {
      commit("setLoading", false);
    }
  },

  clearCurrentSellerVehicle({ commit }: { commit: any }) {
    commit("setCurrentSellerVehicle", null);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
