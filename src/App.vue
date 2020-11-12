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

    <h1>Local Utils</h1>
    <div class="container">
      <div class="row">
        <Utils />
      </div>
    </div>

  </div>
</template>

<script>
import io from "socket.io-client";

import Header from "./components/Header.vue";

import Monitor from "./components/Monitor.vue";
import Utils from "./components/Utils.vue";

export default {
  name: 'App',
  components: {
    appHeader: Header,
    Monitor,
    Utils
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

    setInterval(function() {
      self.socket.emit('getGames')
    }, 60000)

    self.socket.emit('load')
    self.socket.emit('loadGames')

    this.socket.on("updateProcesses", (data) => {
      this.$store.dispatch("updateProcesses", data)
    })

    this.socket.on("updateMongo", (data) => {
      this.$store.dispatch("updateMongo", data)
    })

    this.socket.on("updateGames", (data) => {
      this.$store.dispatch("updateGames", data)
    })

    this.socket.on("updateLogs", (data) => {
      this.$store.dispatch("updateLogs", data)
    })

    this.socket.on("getLog", (data) => {
      this.$store.dispatch("updateLog", data)
    })
  }
}
</script>

<style lang="scss">
  .right {
    text-align: right;
  }
</style>
