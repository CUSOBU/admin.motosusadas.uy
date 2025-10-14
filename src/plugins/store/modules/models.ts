import modelsService, { ModelListParams } from "@/services/modelsService";
import { Model } from "@/types/admin";

type State = {
  models: Model[];
  currentModel: Model | null;
  loading: boolean;
};

const state: State = {
  models: [],
  currentModel: null,
  loading: false,
};

const mutations = {
  setModels(state: State, models: Model[]) {
    state.models = models;
  },
  setCurrentModel(state: State, model: Model | null) {
    state.currentModel = model;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  models: (state: State) => state.models,
  currentModel: (state: State) => state.currentModel,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadModels({ commit }: { commit: any }, params: ModelListParams = {}) {
    try {
      commit("setLoading", true);
      const models = await modelsService.listModels(params);
      commit("setModels", models);
      return Promise.resolve(models);
    } catch (error) {
      commit("setModels", []);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadModelsByBrandId({ commit }: { commit: any }, brandId: string) {
    try {
      commit("setLoading", true);
      const models = await modelsService.getModelsByBrandId(brandId);
      commit("setModels", models);
      return Promise.resolve(models);
    } catch (error) {
      commit("setModels", []);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadModelById({ commit }: { commit: any }, modelId: string) {
    try {
      commit("setLoading", true);
      const model = await modelsService.getModelById(modelId);
      commit("setCurrentModel", model);
      return Promise.resolve(model);
    } catch (error) {
      commit("setCurrentModel", null);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async createModel({ dispatch }: { dispatch: any }, data: any) {
    try {
      const model = await modelsService.createModel(data);
      return Promise.resolve(model);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateModel(
    { dispatch }: { dispatch: any },
    { modelId, data }: { modelId: string; data: any }
  ) {
    try {
      const model = await modelsService.updateModel(modelId, data);
      return Promise.resolve(model);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteModel({ dispatch }: { dispatch: any }, modelId: string) {
    try {
      await modelsService.deleteModel(modelId);
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
