<template>
  <table :style="{ 'color': '#444' }">
    <thead>
      <th>Server</th>
      <th>Status</th>
    </thead>
    <tbody>
      <tr>
        <td>Servers: '{{ servers }}'</td>
      </tr>
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
      console.log('Here', this.$store.getters.getServers)
      return this.$store.getters.getServers
    }
  }
}
</script>
