import brandsService, { BrandListParams } from "@/services/brandsService";
import { Brand } from "@/types/admin";

type State = {
  brands: Brand[];
  currentBrand: Brand | null;
  loading: boolean;
};

const state: State = {
  brands: [],
  currentBrand: null,
  loading: false,
};

const mutations = {
  setBrands(state: State, brands: Brand[]) {
    state.brands = brands;
  },
  setCurrentBrand(state: State, brand: Brand | null) {
    state.currentBrand = brand;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  brands: (state: State) => state.brands,
  currentBrand: (state: State) => state.currentBrand,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadBrands({ commit }: { commit: any }, params: BrandListParams = {}) {
    try {
      commit("setLoading", true);
      const brands = await brandsService.listBrands(params);
      commit("setBrands", brands);
      return Promise.resolve(brands);
    } catch (error) {
      commit("setBrands", []);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadBrandById({ commit }: { commit: any }, brandId: string) {
    try {
      commit("setLoading", true);
      const brand = await brandsService.getBrandById(brandId);
      commit("setCurrentBrand", brand);
      return Promise.resolve(brand);
    } catch (error) {
      commit("setCurrentBrand", null);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async createBrand({ dispatch }: { dispatch: any }, data: any) {
    try {
      const brand = await brandsService.createBrand(data);
      return Promise.resolve(brand);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateBrand(
    { dispatch }: { dispatch: any },
    { brandId, data }: { brandId: string; data: any }
  ) {
    try {
      const brand = await brandsService.updateBrand(brandId, data);
      return Promise.resolve(brand);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteBrand({ dispatch }: { dispatch: any }, brandId: string) {
    try {
      await brandsService.deleteBrand(brandId);
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
