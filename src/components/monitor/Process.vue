<template>
  <table>
    <thead>
      <th>Port</th>
      <th>App</th>
      <th>Running</th>
      <th>Games/Orgs.</th>
    </thead>
    <tbody>
      <tr v-for="(app, index) in processes" :key="index">
        <td :class="status(app)">{{ app.port }}</td>
        <td :class="status(app)">{{ app.name }}</td>
        <td :class="status(app)">
          <span v-if="app.running">{{ app.time }}</span>
          <span v-if="!app.running">FALSE</span>
        </td>
        <td :class="status(app)"><span v-if="games[app.name]">{{ games[app.name].games }}</span></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: [
    'processes',
    'scope'
  ],
  computed: {
    games() {
      console.log(this.$store.getters.getGames)
      return this.$store.getters.getGames
    }
  },
  methods: {
    status(app) {
      if (! app.running) {
        return 'not-running'
      } else if (app.time.match(/^[0-9]/)) {
        return 'today'
      } else {
        return 'running'
      }
    }
  }
}
</script>

<style lang="scss">
  .today {
    background-color: #32CD32;
  }
  .running {
    background-color: green;
  }
  .not-running {
    background-color: red;
  }
</style>
