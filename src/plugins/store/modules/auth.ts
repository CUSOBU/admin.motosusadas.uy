import Cookies from "js-cookie";
import { loginWithPassword } from "@/services/authService";
import { User } from "@/models/user.model";
import { Router } from "vue-router";

type State = {
  token: string | null;
  tokenExpiresAt: string | null;
  user: User | null;
};

// Cargar usuario desde localStorage al inicializar
const loadUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

const state: State = {
  token: Cookies.get("auth-token") || null,
  tokenExpiresAt: Cookies.get("auth-token-expires") || null,
  user: loadUserFromStorage(),
};

const mutations = {
  setToken(state: State, token: string) {
    state.token = token;
    Cookies.set("auth-token", token, { sameSite: "Strict" });
  },
  setTokenExpires(state: State, expiresAt: string) {
    state.tokenExpiresAt = expiresAt;
    Cookies.set("auth-token-expires", expiresAt, { sameSite: "Strict" });
  },
  removeToken(state: State) {
    state.token = null;
    state.tokenExpiresAt = null;
    Cookies.remove("auth-token");
    Cookies.remove("auth-token-expires");
  },
  setUser(state: State, user: User) {
    state.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearUser(state: State) {
    state.user = null;
    localStorage.removeItem("user");
  },
};

const getters = {
  isAuthenticated: (state: State) => {
    if (!state.token) return false;
    if (!state.tokenExpiresAt) return true;
    try {
      const expires = new Date(state.tokenExpiresAt).getTime();
      return Date.now() < expires;
    } catch (e) {
      return true;
    }
  },
  currentUser: (state: State) => state.user,
  userFullName: (state: State) => state.user?.fullName || "",
  userEmail: (state: State) => state.user?.email || "",
  userAgencyName: (state: State) => state.user?.agencyName || "",
};

const actions = {
  async loginWithPassword(
    { commit }: { commit: any },
    { email, password }: { email: string; password: string }
  ) {
    try {
      const response = await loginWithPassword(email, password);

      if (response?.token) {
        commit("setToken", response.token);
        commit("setTokenExpires", response.expiresAt);
        commit("setUser", response.user);
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
  checkExpiration({ commit, state }: { commit: any; state: State }) {
    if (state.token && state.tokenExpiresAt) {
      try {
        const expires = new Date(state.tokenExpiresAt).getTime();
        if (Date.now() >= expires) {
          commit("removeToken");
          commit("clearUser");
        }
      } catch (e) {
        // invalid date: keep session
      }
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
