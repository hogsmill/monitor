<template>
  <div>
    <h2>Apps</h2>
    <table>
      <thead>
        <th>Port</th>
        <th>App</th>
        <th>Running</th>
      </thead>
      <tbody>
        <tr v-for="(app, index) in processes" :key="index">
          <td :class="status(app)">{{ app.port }}</td>
          <td :class="status(app)">{{ app.app }}</td>
          <td :class="status(app)">
          <span v-if="app.running">TRUE</span>
          <span v-if="!app.running">FALSE</span>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>Keeps</h2>
    <table>
      <thead>
        <th>Port</th>
        <th>App</th>
        <th>Running</th>
      </thead>
      <tbody>
        <tr v-for="(app, index) in keeps" :key="index">
          <td :class="status(app)">{{ app.port }}</td>
          <td :class="status(app)">{{ app.app }}</td>
          <td :class="status(app)">
          <span v-if="app.running">TRUE</span>
          <span v-if="!app.running">FALSE</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    processes() {
      return this.$store.getters.getProcesses
    },
    keeps() {
      return this.$store.getters.getKeeps
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
  table {
    width: 80%;
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
