<template>
  <table class="server-table">
    <thead>
      <th>Server</th>
      <th>Status</th>
    </thead>
    <tbody>

      <tr v-for="(server, index) in servers" :key="index">
        <td :class="{ 'server-fail': !server.ok }">
          {{ server.name }}
        </td>
        <td>
          {{ server.ok ? 'OK' : 'FAIL' }}
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
