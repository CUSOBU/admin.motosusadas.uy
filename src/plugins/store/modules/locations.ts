import locationsService, {
  LocationListParams,
} from "@/services/locationsService";
import { Location } from "@/types/admin";

type State = {
  locations: Location[];
  currentLocation: Location | null;
  loading: boolean;
};

const state: State = {
  locations: [],
  currentLocation: null,
  loading: false,
};

const mutations = {
  setLocations(state: State, locations: Location[]) {
    state.locations = locations;
  },
  setCurrentLocation(state: State, location: Location | null) {
    state.currentLocation = location;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  locations: (state: State) => state.locations,
  currentLocation: (state: State) => state.currentLocation,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadLocations(
    { commit }: { commit: any },
    params: LocationListParams = {}
  ) {
    try {
      commit("setLoading", true);
      const locations = await locationsService.listLocations(params);
      commit("setLocations", locations);
      return Promise.resolve(locations);
    } catch (error) {
      commit("setLocations", []);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadLocationById({ commit }: { commit: any }, locationId: string) {
    try {
      commit("setLoading", true);
      const location = await locationsService.getLocationById(locationId);
      commit("setCurrentLocation", location);
      return Promise.resolve(location);
    } catch (error) {
      commit("setCurrentLocation", null);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async createLocation({ dispatch }: { dispatch: any }, data: any) {
    try {
      const location = await locationsService.createLocation(data);
      return Promise.resolve(location);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateLocation(
    { dispatch }: { dispatch: any },
    { locationId, data }: { locationId: string; data: any }
  ) {
    try {
      const location = await locationsService.updateLocation(locationId, data);
      return Promise.resolve(location);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteLocation({ dispatch }: { dispatch: any }, locationId: string) {
    try {
      await locationsService.deleteLocation(locationId);
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
