import Vue from "vue";
import Vuex from "vuex";
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-GB')

Vue.use(Vuex);

const ignoreOutdated = {
  'sass-loader': true,
  'chart.js': true
}

const serverStatus = (server, servers) => {
  let status = true
  for (let i = 0; i < servers.length; i++) {
    if (servers[i].name == server.name) {
      status = servers[i].ok
    }
  }
  return status
}

const serverOutdated = (server, servers) => {
  let status = false
  for (let i = 0; i < servers.length; i++) {
    if (servers[i].name == server.name) {
      status = servers[i].outdated
    }
  }
  return status
}

const checkServerStatus = (server, processes, servers) => {
  let ok = serverStatus(server, servers)
  for (let i = 0; i < processes.length; i++) {
    if (processes[i].server == server.name && !processes[i].running) {
      ok = false
    }
  }
  return ok
}

const checkServerOutdated = (server, processes, outdated, servers) => {
  let outd = serverOutdated(server, servers)
  for (let i = 0; i < processes.length; i++) {
    if (processes[i].server == server.name && !processes[i].notRunning) {
      if (outdated[processes[i].app] && outdated[processes[i].app].length > 0) {
        const appOutdated = outdated[processes[i].app]
        for (let j = 0; j < appOutdated.length; j++) {
          if (!ignoreOutdated[appOutdated[j]]) {
            outd = true
          }
        }
      }
    }
  }
  return outd
}

export const store = new Vuex.Store({
  state: {
    lastUpdated: '',
    servers: {},
    selectedServer: 'default',
    processes: [],
    games: {},
    outdated: {},
    mongo: false,
    mongoConnections: 0,
    logs: [],
    log: {app: '', log: ''}
  },
  getters: {
    getLastUpdated: (state) => {
      return state.lastUpdated;
    },
    getSelectedServer: (state) => {
      return state.selectedServer;
    },
    getServers: (state) => {
      return state.servers;
    },
    getProcesses: (state) => {
      return state.processes;
    },
    getGames: (state) => {
      return state.games;
    },
    getOutdated: (state) => {
      return state.outdated;
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
      console.log(payload)
      let i = 0
      const processes = [], len = Object.keys(payload).length
      for (i = 0; i < len; i++) {
        processes.push(payload[Object.keys(payload)[i]])
      }
      state.processes = processes.sort((a, b) => {
        return a.order - b.order
      })
      let servers = {}
      for (i = 0; i < state.processes.length; i++) {
        if (state.processes[i].server) {
          const server = state.processes[i].server
          servers[server] = {name: server}
        }
      }
      const serverKeys = Object.keys(servers)
      const serverArr = []
      for (i = 0; i < serverKeys.length; i++) {
        const ok = checkServerStatus(servers[serverKeys[i]], state.processes, state.servers)
        const outdated = checkServerOutdated(servers[serverKeys[i]], state.processes, state.outdated, state.servers)
        serverArr.push({name: serverKeys[i], ok: ok, outdated: outdated})
      }
      state.servers = serverArr
    },
    updateGames: (state, payload) => {
      if (!state.games[payload.game]) {
        state.games[payload.game] = {}
      }
      state.games[payload.game].games = payload.games
      let created = '', createdGame = '', lastaccess = '', lastaccessGame = ''
      if (payload.created) {
        created = timeAgo.format(new Date(payload.created))
        createdGame = payload.createdGame
        state.games[payload.game].createdRaw = payload.created
      }
      if (payload.lastaccess) {
        lastaccess = timeAgo.format(new Date(payload.lastaccess))
        lastaccessGame = payload.lastaccessGame
        state.games[payload.game].lastaccessRaw = payload.lastaccess
      }
      state.games[payload.game].created = created
      state.games[payload.game].createdGame = createdGame
      state.games[payload.game].lastaccess = lastaccess
      state.games[payload.game].lastaccessGame = lastaccessGame
    },
    updateOutdated: (state, payload) => {
      state.outdated = payload
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
    },
    updateSelectedServer: (state, payload) => {
      if (payload.name == state.selectedServer) {
        state.selectedServer = ''
      } else {
        state.selectedServer = payload.name
      }
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
    updateOutdated: ({ commit }, payload) => {
      commit("updateOutdated", payload);
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
    },
    updateSelectedServer: ({ commit }, payload) => {
      commit("updateSelectedServer", payload);
    }
  }
});
