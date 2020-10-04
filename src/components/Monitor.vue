<template>
  <div>
    <table>
      <tr>
        <td class="outer">
          <h2>Apps</h2>
          <Process :processes="processes" />
        </td>
        <td class="outer">
          <h2>Keeps</h2>
          <Process :processes="keeps" />
        </td>
        <td class="outer">
          <h2>Logs</h2>
          <table>
            <thead>
              <th>App</th>
            </thead>
            <tbody>
              <tr v-for="(log, index) in logs" :key="index">
                <td class="running">{{ log }}</td>
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
    keeps() {
      return this.$store.getters.getKeeps
    },
    logs() {
      return this.$store.getters.getLogs
    }
  },
  methods: {
    status(app) {
      return app.running ? 'running' : 'not-running'
    }
  }
}
</script>

<style lang="scss">
  h2, th {
    color: #000;
  }
  td.outer {
    vertical-align: top;
  }
  table {
    margin: 0 auto;
  }
  td {
    color: #fff;
    padding: 6px;
  }
  .running {
    background-color: green;
  }
  .not-running {
    background-color: red;
  }
</style>
