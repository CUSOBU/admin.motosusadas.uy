import userService, { UserListParams } from "@/services/userService";
import { User } from "@/models/user.model";

type State = {
  users: User[];
  currentUser: User | null;
  total: number;
  loading: boolean;
};

const state: State = {
  users: [],
  currentUser: null,
  total: 0,
  loading: false,
};

const mutations = {
  setUsers(state: State, users: User[]) {
    state.users = users;
  },
  setCurrentUser(state: State, user: User | null) {
    state.currentUser = user;
  },
  setTotal(state: State, total: number) {
    state.total = total;
  },
  setLoading(state: State, loading: boolean) {
    state.loading = loading;
  },
};

const getters = {
  users: (state: State) => state.users,
  currentUser: (state: State) => state.currentUser,
  total: (state: State) => state.total,
  loading: (state: State) => state.loading,
};

const actions = {
  async loadUsers({ commit }: { commit: any }, params: UserListParams = {}) {
    try {
      commit("setLoading", true);
      const users = await userService.listUsers(params);
      commit("setUsers", users);
      commit("setTotal", users.length); // Adjust if API returns pagination meta
      return Promise.resolve(users);
    } catch (error) {
      commit("setUsers", []);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async loadUserById({ commit }: { commit: any }, userId: string) {
    try {
      commit("setLoading", true);
      const user = await userService.getUserById(userId);
      commit("setCurrentUser", user);
      return Promise.resolve(user);
    } catch (error) {
      commit("setCurrentUser", null);
      return Promise.reject(error);
    } finally {
      commit("setLoading", false);
    }
  },

  async createUser({ dispatch }: { dispatch: any }, userData: any) {
    try {
      const user = await userService.createUser(userData);
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateUser(
    { dispatch }: { dispatch: any },
    { userId, data }: { userId: string; data: any }
  ) {
    try {
      const user = await userService.updateUser(userId, data);
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async activateUser({ dispatch }: { dispatch: any }, userId: string) {
    try {
      await userService.activateUser(userId);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deactivateUser({ dispatch }: { dispatch: any }, userId: string) {
    try {
      await userService.deactivateUser(userId);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteUser({ dispatch }: { dispatch: any }, userId: string) {
    try {
      await userService.deleteUser(userId);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  clearCurrentUser({ commit }: { commit: any }) {
    commit("setCurrentUser", null);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
