<template>
  <table>
    <thead>
      <th>Port</th>
      <th>App</th>
      <th>Running</th>
    </thead>
    <tbody>
      <tr v-for="(app, index) in processes" :key="index">
        <td :class="status(app)">{{ app.port }}</td>
        <td :class="status(app)">{{ app.app }}</td>
        <td :class="status(app)">
          <span v-if="app.running">TRUE</span>
          <span v-if="!app.running">FALSE</span>
        </td>
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
  methods: {
    status(app) {
      if (this.scope == 'keep' && !app.keep) {
        return 'not-applicable'
      } else {
        return app.running ? 'running' : 'not-running'
      }
    }
  }
}
</script>

<style lang="scss">
  .not-applicable {
    background-color: #ccc;
    color: #444;
  }
  .running {
    background-color: green;
  }
  .not-running {
    background-color: red;
  }
</style>
