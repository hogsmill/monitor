import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    lastUpdated: '',
    processes: [],
    mongo: false,
    logs: []
  },
  getters: {
    getLastUpdated: (state) => {
      return state.lastUpdated;
    },
    getProcesses: (state) => {
      return state.processes;
    },
    getMongo: (state) => {
      return state.mongo;
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
    updateMongo: (state, payload) => {
      state.mongo = !!payload;
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
    updateMongo: ({ commit }, payload) => {
      commit("updateMongo", payload);
    },
    updateLogs: ({ commit }, payload) => {
      commit("updateLogs", payload);
    }
  }
});
