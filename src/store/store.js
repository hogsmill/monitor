import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    lastUpdated: '',
    processes: [],
    keeps: [],
    logs: []
  },
  getters: {
    getLastUpdated: (state) => {
      return state.lastUpdated;
    },
    getProcesses: (state) => {
      return state.processes;
    },
    getKeeps: (state) => {
      return state.keeps;
    },
    getLogs: (state) => {
      return state.logs;
    }
  },
  mutations: {
    updateLastUpdated: (state, payload) => {
      state.lastUpdated = payload;
    },
    updateProcesses: (state, payload) => {
      state.processes = payload;
    },
    updateKeeps: (state, payload) => {
      state.keeps = payload;
    },
    updateLogs: (state, payload) => {
      state.logs = payload;
    }
  },
  actions: {
    updateLastUpdated: ({ commit }, payload) => {
      commit("updateLastUpdated", payload);
    },
    updateProcesses: ({ commit }, payload) => {
      commit("updateProcesses", payload);
    },
    updateKeeps: ({ commit }, payload) => {
      commit("updateKeeps", payload);
    },
    updateLogs: ({ commit }, payload) => {
      commit("updateLogs", payload);
    }
  }
});
