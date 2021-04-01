<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="https://agilesimulations.co.uk">
      <img src="/lego.png" class="ml-4" height="38px">
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <h1>Monitor</h1>
      <div class="last-updated">
        Last Updated: {{ lastUpdated }}
        <button v-if="running" @click="stop()">Stop</button>
        <button v-if="!running" @click="start()">Start</button>
      </div>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" :class="{ active: !showFacilitator }">
          <a class="nav-link pointer" @click="updateShowFacilitator(false)">Game</a>
        </li>
        <li v-if="isHost" class="nav-item" :class="{ active: showFacilitator }">
          <a class="nav-link pointer" @click="updateShowFacilitator(true)">Facilitator</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      running: true
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
    lastUpdated() {
      return this.$store.getters.getLastUpdated
    }
  },
  methods: {
    updateShowFacilitator(payload) {
      this.$store.dispatch('updateShowFacilitator', payload)
    },
    stop() {
      this.running = false
    },
    start() {
      this.running = true
    }
  },
}
</script>

<style>
h1 {
  letter-spacing: initial;
  margin-left: 6px;
  font-weight: bold;
  text-shadow: 2px 2px 3px #444;
  font-size: xx-large;
  line-height: 1;
}
.last-updated {
  letter-spacing: normal;
  display: inline-block;
  padding-right: 6px;
  width: 100%;
  text-align: right;
}
</style>
