import contactInfoService from "@/services/contactInfoService";
import {
  ContactInfo,
  UpdateContactInfoRequest,
} from "@/models/contact-info.model";

interface State {
  contactInfo: ContactInfo | null;
  loading: boolean;
}

const state: State = {
  contactInfo: null,
  loading: false,
};

const mutations = {
  setContactInfo(state: State, contactInfo: ContactInfo) {
    state.contactInfo = contactInfo;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  contactInfo: (state: State) => state.contactInfo,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadContactInfo({ commit }: any) {
    try {
      commit("setLoading", true);
      const contactInfo = await contactInfoService.getContactInfo();

      commit("setContactInfo", contactInfo);
      return contactInfo;
    } catch (error) {
      commit("setContactInfo", null);
      throw error;
    } finally {
      commit("setLoading", false);
    }
  },

  async updateContactInfo({ commit }: any, data: UpdateContactInfoRequest) {
    try {
      commit("setLoading", true);
      const contactInfo = await contactInfoService.updateContactInfo(data);
      commit("setContactInfo", contactInfo);
      return contactInfo;
    } catch (error) {
      throw error;
    } finally {
      commit("setLoading", false);
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
