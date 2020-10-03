import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    processes: []
  },
  getters: {
    getProcesses: (state) => {
      return state.processes;
    }
  },
  mutations: {
    updateProcesses: (state, payload) => {
      state.processes = payload;
    }
  },
  actions: {
    updateProcesses: ({ commit }, payload) => {
      commit("updateProcesses", payload);
    }
  }
});
