import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    lastUpdated: '',
    processes: [],
    games: {},
    mongo: false,
    mongoConnections: 0,
    logs: [],
    log: {app: '', log: ''}
  },
  getters: {
    getLastUpdated: (state) => {
      return state.lastUpdated;
    },
    getProcesses: (state) => {
      return state.processes;
    },
    getGames: (state) => {
      return state.games;
    },
    getMongo: (state) => {
      return state.mongo;
    },
    getMongoConnections: (state) => {
      return state.mongoConnections;
    },
    getLogs: (state) => {
      return state.logs;
    },
    getLog: (state) => {
      return state.log;
    }
  },
  mutations: {
    updateLastUpdated: (state, payload) => {
      state.lastUpdated = payload;
    },
    updateProcesses: (state, payload) => {
      state.processes = payload;
    },
    updateGames: (state, payload) => {
      state.games[payload.game] = payload.games
      console.log(state.games)
    },
    updateMongo: (state, payload) => {
      state.mongo = !!payload;
    },
    updateMongoConnections: (state, payload) => {
      state.mongoConnections = payload;
    },
    updateLogs: (state, payload) => {
      state.logs = payload;
    },
    updateLog: (state, payload) => {
      state.log.app = payload.app
      state.log.log = payload.log;
    }
  },
  actions: {
    updateLastUpdated: ({ commit }, payload) => {
      commit("updateLastUpdated", payload);
    },
    updateProcesses: ({ commit }, payload) => {
      commit("updateProcesses", payload);
    },
    updateGames: ({ commit }, payload) => {
      commit("updateGames", payload);
    },
    updateMongo: ({ commit }, payload) => {
      commit("updateMongo", payload);
    },
    updateMongoConnections: ({ commit }, payload) => {
      commit("updateMongoConnections", payload);
    },
    updateLogs: ({ commit }, payload) => {
      commit("updateLogs", payload);
    },
    updateLog: ({ commit }, payload) => {
      commit("updateLog", payload);
    }
  }
});
