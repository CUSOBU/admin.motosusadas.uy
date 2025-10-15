import { createStore } from "vuex";
import auth from "./modules/auth";
import notificator from "./modules/notificator";
import users from "./modules/users";
import locations from "./modules/locations";
import agencies from "./modules/agencies";
import brands from "./modules/brands";
import types from "./modules/types";
import models from "./modules/models";
import motorcycles from "./modules/motorcycles";

export interface State {
  isLoading: boolean;
  useLoading: boolean;
  openDrawer: boolean;
  users: User[];
}
type User = {
  id: string;
  dialogVisible: boolean;
};

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  strict: debug,
  modules: {
    auth,
    notificator,
    users,
    locations,
    agencies,
    brands,
    types,
    models,
    motorcycles,
  },
  state: {
    isLoading: false,
    useLoading: true,
    openDrawer: true,
    users: [],
  },
  mutations: {
    SET_LOADING(state: State, payload: boolean) {
      state.isLoading = payload;
    },
    SET_USE_LOADING(state: State, payload: boolean) {
      state.useLoading = payload;
    },
    SET_DIALOG_VISIBLE(state, { Id, value }) {
      const user = state.users.find((user) => user.id === Id);
      if (user) {
        user.dialogVisible = value;
      }
    },

    toggleDrawer(state: State) {
      state.openDrawer = !state.openDrawer;
    },

    setDrawerOpen(state: State, isOpen: boolean) {
      state.openDrawer = isOpen;
    },
  },
  actions: {
    SET_LOADING({ commit }, payload: boolean) {
      commit("SET_LOADING", payload);
    },

    DISABLE_LOADING({ commit }) {
      commit("SET_USE_LOADING", false);
    },

    async SOME_ASYNC_ACTION({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_LOADING", false);
    },
  },
});
