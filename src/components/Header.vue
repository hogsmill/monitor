<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="http://agilesimulations.co.uk">
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
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showFacilitator() {
      return this.$store.getters.getShowFacilitator
    },
  },
  methods: {
    updateShowFacilitator(payload) {
      this.$store.dispatch('updateShowFacilitator', payload)
    },
  },
}
</script>
