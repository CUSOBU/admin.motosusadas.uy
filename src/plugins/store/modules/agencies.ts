import agenciesService, { AgencyListParams } from "@/services/agenciesService";
import { Agency } from "@/types/admin";

type State = {
  agencies: Agency[];
  currentAgency: Agency | null;
  loading: boolean;
};

const state: State = {
  agencies: [],
  currentAgency: null,
  loading: false,
};

const mutations = {
  setAgencies(state: State, agencies: Agency[]) {
    state.agencies = agencies;
  },
  setCurrentAgency(state: State, agency: Agency | null) {
    state.currentAgency = agency;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  agencies: (state: State) => state.agencies,
  currentAgency: (state: State) => state.currentAgency,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadAgencies(
    { commit }: { commit: any },
    params: AgencyListParams = {}
  ) {
    try {
      commit("setLoading", true);
      const agencies = await agenciesService.listAgencies(params);
      commit("setAgencies", agencies);
      return Promise.resolve(agencies);
    } catch (error) {
      commit("setAgencies", []);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadAgencyById({ commit }: { commit: any }, agencyId: string) {
    try {
      commit("setLoading", true);
      const agency = await agenciesService.getAgencyById(agencyId);
      commit("setCurrentAgency", agency);
      return Promise.resolve(agency);
    } catch (error) {
      commit("setCurrentAgency", null);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async createAgency({ dispatch }: { dispatch: any }, data: any) {
    try {
      const agency = await agenciesService.createAgency(data);
      return Promise.resolve(agency);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateAgency(
    { dispatch }: { dispatch: any },
    { agencyId, data }: { agencyId: string; data: any }
  ) {
    try {
      const agency = await agenciesService.updateAgency(agencyId, data);
      return Promise.resolve(agency);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteAgency({ dispatch }: { dispatch: any }, agencyId: string) {
    try {
      await agenciesService.deleteAgency(agencyId);
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
