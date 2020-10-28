<template>
  <div>
    <table>
      <tr>
        <td class="outer">
          <h2>Apps</h2>
          <Process :processes="processes" :scope="'app'" />
        </td>
        <td class="outer">
          <h2>Procs</h2>
          <table class="logs">
            <thead>
              <tr>
                <th>Status</th>
                <th>Process</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" :checked="mongo" />
                </td>
                <td>Mongo</td>
              </tr>
            </tbody>
          </table>
        </td>
        <td class="outer logs">
          <h2>Logs</h2>
          {{ currentLog }}
          <table v-if="!log" class="logs">
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
                <td v-if="log.app == currentLog.app" colspan="3" class="log-div">
                  <div>
                    <button @click="clearLog()">Done</button>
                  </div>
                  <div>
                    {{ currentLog.log }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Process from "./monitor/Process.vue";

export default {
  props: [
    'socket'
  ],
  components: {
    Process
  },
  computed: {
    processes() {
      return this.$store.getters.getProcesses
    },
    keep() {
      return this.$store.getters.getKeep
    },
    mongo() {
      return this.$store.getters.getMongo
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
      this.socket.emit('getLog', {app: log.app})
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
