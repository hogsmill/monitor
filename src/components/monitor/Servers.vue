<template>
  <table class="server-table">
    <thead>
      <th />
      <th>Server</th>
      <th>Status</th>
      <th />
    </thead>
    <tbody>

      <tr v-for="(server, index) in servers" :key="index">
        <td>
          <input type="checkbox" :checked="server.name == selectedServer">
        </td>
        <td :class="{ 'server-fail': !server.ok }">
          {{ server.name }}
        </td>
        <td>
          {{ server.ok ? 'OK' : 'FAIL' }}
        </td>
        <td>
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
      console.log('Selected Server', this.$store.getters.getSelectedServer)
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
    td {
      background-color: green;

      &.server-fail {
        background-color: red;
      }
    }
  }
</style>
