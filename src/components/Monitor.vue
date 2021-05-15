<template>
  <div>
    <table>
      <tr>
        <td class="outer">
          <Servers />
        </td>
        <td class="outer">
          <table class="logs">
            <thead>
              <tr>
                <th>Apps</th>
                <th>Other</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mongo</td>
                <td>
                  <input type="checkbox" :checked="mongo" />
                </td>
                <td><span v-if="mongoConnections">{{ mongoConnections.current }} / {{ mongoConnections.available }}</span></td>
              </tr>
            </tbody>
          </table>
          <table class="apps logs">
            <thead>
              <th>App</th>
              <th>Date</th>
              <th>Size</th>
            </thead>
            <tbody>
              <tr v-for="(log, index) in logs" :key="index">
                <td v-if="log.app != currentLog.app" class="link" @click="getLog(log)">{{ log.app }}</td>
                <td v-if="log.app != currentLog.app">{{ log.date }}</td>
                <td v-if="log.app != currentLog.app">{{ log.size }}</td>
                <td v-if="log.app != currentLog.app"><button class="btn btn-sm btn-secondary smaller-font" @click="deleteLog(log)">Delete</button></td>
                <td v-if="log.app == currentLog.app" colspan="4" class="log-div">
                  <div>
                    <button class="btn btn-sm btn-secondary smaller-font" @click="clearLog()">Done</button> {{ log.app}}
                  </div>
                  <div>
                    <pre>{{ currentLog.log }}</pre>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="outer">
          <Process :scope="'app'" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import bus from '../socket.js'

import Servers from "./monitor/Servers.vue";
import Process from "./monitor/Process.vue";

export default {
  components: {
    Servers,
    Process
  },
  computed: {
    keep() {
      return this.$store.getters.getKeep
    },
    mongo() {
      return this.$store.getters.getMongo
    },
    mongoConnections() {
      return this.$store.getters.getMongoConnections
    },
    logs() {
      return this.$store.getters.getLogs
    },
    currentLog() {
      return this.$store.getters.getLog
    }
  },
  methods: {
    getLog(log) {
      bus.$emit('sendGetLog', {app: log.app})
    },
    deleteLog(log) {
      if (confirm('Delete ' + log.app + '?')) {
        bus.$emit('sendDeleteLog', {app: log.app})
      }
    },
    clearLog() {
      this.$store.dispatch("updateLog", {app: '', log: ''})
    }
  }
}
</script>

<style lang="scss">
  h2, th {
    color: #000;
    padding: 2px 20px;
  }
  td.outer {
    vertical-align: top;

    &.logs {
      width: 400px;
    }
  }
  table {
    margin: 0 auto;
  }
  td {
    color: #fff;
    padding: 6px;
  }
  .logs {
    tbody {
      td {
        background-color: #ccc;
        color: #000;
      }
    }
  }
  .log-div {
    text-align: left;
    color: #000;
  }
  .link:hover {
    color: #888;
    text-decoration: underline;
  }
</style>
