<template>
  <table class="apps">
    <thead>
      <th v-if="selectedServer == 'default'">
        V3
      </th>
      <th v-if="selectedServer == 'default'">
        Login
      </th>
      <th v-if="selectedServer == 'default'">
        Clear LS
      </th>
      <th>Port</th>
      <th>App</th>
      <th>Outdated</th>
      <th>Running</th>
      <th>Games/Orgs.</th>
      <th>Newest</th>
      <th>Latest</th>
    </thead>
    <tbody>
      <tr v-for="(app, index) in processes" :class="{'not-running': app.notRunning}" :key="index">
        <td v-if="app.server == selectedServer && selectedServer == 'default'" :class="status(app)">
          <span v-if="app.v3">&#10004;</span>
        </td>
        <td v-if="app.server == selectedServer && selectedServer == 'default'" :class="status(app)">
          <span v-if="app.login">&#10004;</span>
        </td>
        <td v-if="app.server == selectedServer && selectedServer == 'default'" :class="status(app)">
          <span v-if="app.clearLocalStorage">&#10004;</span>
        </td>
        <td v-if="app.server == selectedServer" :class="status(app)">
          {{ app.port }}
        </td>
        <td v-if="app.server == selectedServer" :class="status(app)" class="app">
          <a :href="'https://agilesimulations.co.uk/' + app.app" target="blank">{{ app.name }}</a>
        </td>
        <td v-if="app.server == selectedServer" :class="status(app)">
          <div v-if="outdated[app.app]" class="outdated">
            <div v-for="(outd, oindex) in outdated[app.app]" :key="oindex">
              {{ outd }}
            </div>
          </div>
        </td>
        <td v-if="app.server == selectedServer" :class="status(app)">
          <span v-if="app.running">{{ app.time }}</span>
          <span v-if="!app.running">FALSE</span>
        </td>
        <td v-if="app.server == selectedServer" :class="status(app)">
          <span v-if="games[app.name]">{{ games[app.name].games }}</span>
        </td>
        <td v-if="app.server == selectedServer" :class="status(app)">
          <span v-if="games[app.name]">{{ games[app.name].created }}, {{ games[app.name].createdGame }}</span>
        </td>
        <td v-if="app.server == selectedServer" :class="status(app)">
          <span v-if="games[app.name]">{{ games[app.name].lastaccess }}, {{ games[app.name].lastaccessGame }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: [
    'scope'
  ],
  computed: {
    processes() {
      return this.$store.getters.getProcesses
    },
    games() {
      return this.$store.getters.getGames
    },
    selectedServer() {
      return this.$store.getters.getSelectedServer
    },
    outdated() {
      return this.$store.getters.getOutdated
    }
  },
  methods: {
    status(app) {
      if (! app.running) {
        return 'not-running'
      } else if (app.time.match(/^[0-9]+:/)) {
        return 'today'
      } else {
        return 'running'
      }
    }
  }
}
</script>

<style lang="scss">
  .apps {
    td {
     padding: 0 1px;
     border-top: 1px solid olive;
     border-bottom: 1px solid olive;
    }
  }
  .app {
    a {
      color: #fff;

      &:hover {
        color: #ddd;
      }
    }
  }

  .not-running {
    td {
      color: #888;
      background-color: #ddd;

      a {
        color: #888;
      }
    }
  }
  .today {
    background-color: #32CD32;
  }
  .running {
    background-color: green;
  }
  .not-running {
    background-color: red;
  }
  .outdated {
    background-color: red
  }
</style>
