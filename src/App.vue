<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>

    <h1>Monitor</h1>
    <div class="right">Last Updated: {{ lastUpdated }}</div>
    <div class="container">
      <div class="row">
        <Monitor v-bind:socket="socket" />
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

import Header from "./components/Header.vue";

import Monitor from "./components/Monitor.vue";

export default {
  name: 'App',
  components: {
    appHeader: Header,
    Monitor
  },
  computed: {
    lastUpdated() {
      return this.$store.getters.getLastUpdated
    }
  },
  created() {
    var host = "77.68.122.69"
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    var connStr = "http://" + host + ":3012"
    console.log("Connecting to: " + connStr)
    this.socket = io(connStr)

    this.socket.on("updateProcesses", (data) => {
      this.$store.dispatch("updateProcesses", data)
    })

    this.socket.on("updateKeeps", (data) => {
      this.$store.dispatch("updateKeeps", data)
    })

    this.socket.on("updateLogs", (data) => {
      this.$store.dispatch("updateLogs", data)
    })
  }
}
</script>

<style lang="scss">

</style>
