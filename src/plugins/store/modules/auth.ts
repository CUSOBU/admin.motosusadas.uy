import Cookies from "js-cookie";
import { login, loginWithPassword } from "@/services/authService";
import { Router } from "vue-router";

type State = {
  token: string | null;
  authTokenExpires: string | null;
  user: any | null;
};

const state: State = {
  token: Cookies.get("auth-token") || null,
  authTokenExpires: Cookies.get("auth-token-expires") || null,
  user: null,
};

const mutations = {
  setToken(state: State, token: string) {
    state.token = token;
    Cookies.set("auth-token", token, { secure: true, sameSite: "Strict" });
  },
  removeToken(state: State) {
    state.token = null;
    Cookies.remove("auth-token");
  },
  setUser(state: State, user: any) {
    state.user = user;
  },
  clearUser(state: State) {
    state.user = null;
  },
};

const getters = {
  isAuthenticated: (state: State) => !!state.token,
  currentUser: (state: State) => state.user,
};

const actions = {
  async loginWithPassword(
    { commit }: { commit: any },
    { email, password }: { email: string; password: string }
  ) {
    try {
      const response = await loginWithPassword(email, password);

      // REST response shape: { token, user }
      if (response?.token) {
        commit("setToken", response.token);
        commit("setUser", response.user || null);
      }
      return Promise.resolve(response);
    } catch (error: any) {
      return Promise.reject(error);
    }
  },

  async login(
    { commit }: { commit: any },
    { phoneNumber, pin }: { phoneNumber: string; pin: string }
  ) {
    try {
      const response = await login(phoneNumber, pin);

      // REST response shape: { token, user }
      if (response?.token) {
        commit("setToken", response.token);
        commit("setUser", response.user || null);
      }
      return Promise.resolve(response);
    } catch (error: any) {
      return Promise.reject(error);
    }
  },

  logout({ commit }: { commit: any }, router: Router) {
    commit("removeToken");
    commit("clearUser");
    router.push({ name: "UserLogin" });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
