import Vue from "vue";
import Vuex from "vuex";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-GB')

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
      console.log(state.games)
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
      if (!state.games[payload.game]) {
        state.games[payload.game] = {}
      }
      state.games[payload.game].games = payload.games
      if (payload.newest) {
        const newest = timeAgo.format(new Date(payload.newest))
        state.games[payload.game].newest = newest
        state.games[payload.game].raw = payload.newest
      }
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
