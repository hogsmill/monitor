import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    processes: [],
    keeps: []
  },
  getters: {
    getProcesses: (state) => {
      return state.processes;
    },
    getKeeps: (state) => {
      return state.keeps;
    }
  },
  mutations: {
    updateProcesses: (state, payload) => {
      state.processes = payload;
    },
    updateKeeps: (state, payload) => {
      state.keeps = payload;
    }
  },
  actions: {
    updateProcesses: ({ commit }, payload) => {
      commit("updateProcesses", payload);
    },
    updateKeeps: ({ commit }, payload) => {
      commit("updateKeeps", payload);
    }
  }
});
