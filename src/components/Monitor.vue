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
          <table>
            <tr>
              <td>
                <input type="checkbox" :value="keep" />
              </td>
              <td>Keep</td>
            </tr>
            <tr>
              <td>
                <input type="checkbox" :value="mongo" />
              </td>
              <td>Mongo</td>
            </tr>
          </table>
        </td>
        <td class="outer">
          <h2>Logs</h2>
          <table class="logs">
            <thead>
            <th>App</th>
            <th>Date</th>
            <th>Size</th>
            </thead>
            <tbody>
              <tr v-for="(log, index) in logs" :key="index">
                <td>{{ log.app }}</td>
                <td>{{ log.date }}</td>
                <td>{{ log.size }}</td>
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
  .logs {
    tbody {
      td {
        background-color: #ccc;
        color: #000;
      }
    }
  }
</style>
