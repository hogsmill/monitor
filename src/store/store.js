import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    processes: [],
    keeps: [],
    logs: []
  },
  getters: {
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
