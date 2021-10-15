<template>
  <div id="app" class="mb-4">
    <Header />
    <div class="right">
    </div>
    <div class="container">
      <div class="row">
        <Monitor />
      </div>
    </div>

    <h2>Assessments</h2>
    <div class="container">
      <div class="row">
        <Assessments />
      </div>
    </div>

    <h2>Local Utils</h2>
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
import Assessments from "./components/Assessments.vue";
import Utils from "./components/Utils.vue";

export default {
  name: 'App',
  components: {
    Header,
    Monitor,
    Assessments,
    Utils
  },
  data() {
    return {
      running: true
    }
  },
  created() {
    const self = this
    setInterval(() => {
      bus.$emit('sendLoad')
      self.$store.dispatch("updateLastUpdated", new Date().toGMTString())
    }, 5000)

    setInterval(() => {
      if (this.running) {
        bus.$emit('sendGetGames')
      }
    }, 60000)

    setInterval(() => {
      bus.$emit('sendGetOutdated')
    }, 5000)

    setInterval(() => {
      bus.$emit('sendGetConnections')
    }, 60000)

    bus.$emit('sendGetGames')
    bus.$emit('sendGetConnections')
    bus.$emit('sendGetOutdated')

    bus.$on("updateProcesses", (data) => {
      console.log(data)
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

    bus.$on("updateOutdated", (data) => {
      this.$store.dispatch("updateOutdated", data)
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
