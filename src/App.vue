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

    const self = this
    setInterval(function() {
      self.socket.emit('load')
      self.$store.dispatch("updateLastUpdated", new Date().toGMTString())
    }, 5000)

    this.socket.on("updateProcesses", (data) => {
      this.$store.dispatch("updateProcesses", data)
    })

    this.socket.on("updateMongo", (data) => {
      this.$store.dispatch("updateMongo", data)
    })

    this.socket.on("updateLogs", (data) => {
      this.$store.dispatch("updateLogs", data)
    })

    this.socket.on("getLog", (data) => {
      console.log(data)
      //this.$store.dispatch("getLog", data)
    })
  }
}
</script>

<style lang="scss">
  .right {
    text-align: right;
  }
</style>
