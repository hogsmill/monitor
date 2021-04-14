<template>
  <table>
    <thead>
      <th>Server</th>
      <th>Status</th>
    </thead>
    <tbody>
      <tr v-for="(server, index) in servers" :key="index">
        <td>
          {{ server.name }}
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
