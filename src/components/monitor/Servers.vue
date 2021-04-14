<template>
  <table class="server-table">
    <thead>
      <th />
      <th>Server</th>
      <th>Apps</th>
      <th>Outdated<br />(<i>ignores sass-loader and chatr.js</i>)</th>
      <th />
    </thead>
    <tbody>
      <tr v-for="(server, index) in servers" :key="index">
        <td :class="{ 'server-fail': !server.ok || server.outdated }">
          <input type="checkbox" :checked="server.name == selectedServer">
        </td>
        <td :class="{ 'server-fail': !server.ok || server.outdated }">
          {{ server.name }}
        </td>
        <td :class="{ 'server-fail': !server.ok || server.outdated }">
          {{ server.ok ? 'OK' : 'FAIL' }}
        </td>
        <td :class="{ 'server-fail': !server.ok || server.outdated }">
          {{ server.outdated ? 'FAIL' : 'OK' }}
        </td>
        <td :class="{ 'server-fail': !server.ok || server.outdated }">
          <button @click="toggleShowServer(server)">Show</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  computed: {
    servers() {
      return this.$store.getters.getServers
    },
    selectedServer() {
      return this.$store.getters.getSelectedServer
    }
  },
  methods: {
    toggleShowServer(server) {
      this.$store.dispatch('updateSelectedServer', server)
    }
  }
}
</script>

<style lang="scss">
  .server-table {
    th {
     vertical-align: bottom;
    }
    td {
      background-color: green;

      &.server-fail {
        background-color: red;
      }
    }
  }
</style>
