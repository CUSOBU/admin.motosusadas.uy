import typesService, { TypeListParams } from "@/services/typesService";
import { Type } from "@/types/admin";

type State = {
  types: Type[];
  currentType: Type | null;
  loading: boolean;
};

const state: State = {
  types: [],
  currentType: null,
  loading: false,
};

const mutations = {
  setTypes(state: State, types: Type[]) {
    state.types = types;
  },
  setCurrentType(state: State, type: Type | null) {
    state.currentType = type;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  types: (state: State) => state.types,
  currentType: (state: State) => state.currentType,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadTypes({ commit }: { commit: any }, params: TypeListParams = {}) {
    try {
      commit("setLoading", true);
      const types = await typesService.listTypes(params);
      commit("setTypes", types);
      return Promise.resolve(types);
    } catch (error) {
      commit("setTypes", []);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadTypeById({ commit }: { commit: any }, typeId: string) {
    try {
      commit("setLoading", true);
      const type = await typesService.getTypeById(typeId);
      commit("setCurrentType", type);
      return Promise.resolve(type);
    } catch (error) {
      commit("setCurrentType", null);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async createType({ dispatch }: { dispatch: any }, data: any) {
    try {
      const type = await typesService.createType(data);
      return Promise.resolve(type);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateType(
    { dispatch }: { dispatch: any },
    { typeId, data }: { typeId: string; data: any }
  ) {
    try {
      const type = await typesService.updateType(typeId, data);
      return Promise.resolve(type);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteType({ dispatch }: { dispatch: any }, typeId: string) {
    try {
      await typesService.deleteType(typeId);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
