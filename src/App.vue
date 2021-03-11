<template>
  <div id="app" class="mb-4">
    <appHeader></appHeader>

    <h1>
      Monitor
      <button v-if="running" @click="stop()">Stop</button>
      <button v-if="!running" @click="start()">Start</button>
    </h1>
    <div class="right">Last Updated: {{ lastUpdated }}</div>
    <div class="container">
      <div class="row">
        <Monitor />
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
import bus from './socket.js'

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
  data() {
    return {
      running: true
    }
  },
  computed: {
    lastUpdated() {
      return this.$store.getters.getLastUpdated
    }
  },
  methods: {
    stop() {
      this.running = false
    },
    start() {
      this.running = true
    }
  },
  created() {

    const self = this
    setInterval(function() {
      bus.$emit('sendLoad')
      self.$store.dispatch("updateLastUpdated", new Date().toGMTString())
    }, 5000)

    setInterval(function() {
      if (this.running) {
        bus.$emit('sendGetGames')
      }
    }, 60000)

    setInterval(function() {
      bus.$emit('sendGetConnections')
    }, 60000)

    bus.$emit('sendGetGames')
    bus.$emit('sendGetConnections')

    bus.$on("updateProcesses", (data) => {
      this.$store.dispatch("updateProcesses", data)
    })

    bus.$on("updateMongo", (data) => {
      this.$store.dispatch("updateMongo", data)
    })

    bus.$on("updateMongoConnections", (data) => {
      this.$store.dispatch("updateMongoConnections", data)
    })

    bus.$on("updateGames", (data) => {
      this.$store.dispatch("updateGames", data)
    })

    bus.$on("updateLogs", (data) => {
      this.$store.dispatch("updateLogs", data)
    })

    bus.$on("getLog", (data) => {
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
