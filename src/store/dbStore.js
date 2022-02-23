
const execSync = require('child_process').execSync;
const fs = require('fs')
const process = require('process');

const v3 = {
  'Agile Simulations': true
}

const login = {
  'Agile Simulations': true,
  'Coin Game': true,
  'Planning Poker': true,
  'No Estimates': true,
  'Kanban Playground': true,
  'Agile Battleships': true,
  '5 Dysfunctions': true,
  'Team Health Check': true
}

const clearLocalStorage = {
  'Coin Game': true,
  'No Estimates': true,
  'No Estimates Mobile': true,
  'Kanban Playground': true,
  'Kanban Playground Mobile': true,
  'Planning Poker': true,
  'Agile Battleships': true,
  'Context Switching': true,
  'BA Shouting': true,
  'Survival At Sea': true,
  '5 Dysfunctions': true,
  'Team Health Check': true,
  'Agile Maturity': true
}

const notRunning = {
  'Pig Racing': true
}

const state = () => {
  let apps = {}
  const genericData = fs.readFileSync('/usr/keep/apps.txt', 'utf8').split("\n")
  const customerData = fs.readFileSync('/usr/keep/customerApps.txt', 'utf8').split("\n")
  const data = genericData.concat(customerData)
  for (let i = 0; i < data.length; i++) {
    if (data[i].match(/^\w+,[0-9]{4},/)) {
      const fields = data[i].split(",")
      const port = fields[1]
      const name = fields[3]
      apps[port] = {
        notRunning: notRunning[name],
        v3: v3[name],
        login: login[name],
        clearLocalStorage: clearLocalStorage[name],
        order: i,
        server: fields[0],
        port: port,
        app: fields[2],
        name: name
      }
    }
  }
  return apps
}

const parseProcesses = (data) => {
  let processes = state()
  const splitData = data ? data.split("\n") : []
  for (let i = 0; i < splitData.length; i++) {

    // Format: root      69680  67829  0 13:28 pts/1    00:00:00 node /usr/apps/coin-game/src/server.js 3000 Coin Game

    if (splitData[i].match(/server.js/)) {
      const fields = splitData[i].split(/\s+/)
      const port = fields[9]
      if (!processes[port]) {
        processes[port] = {}
      }
      processes[port].running = true
      processes[port].time = fields[4]
    }
  }
  return processes
}

const parseLogs = (data) => {
  let logs = []
  const splitData = data ? data.split("\n") : []
  for (let i = 0; i < splitData.length; i++) {
    if (splitData[i].match(/root root/) && splitData[i].match(/.log/)) {
      let log = {}

      // Format: -rw-r--r-- 1 root root 71 Oct 24 10:12 monitor.log

      const fields = splitData[i].split (/\s+/)
      log.size = fields[4]
      log.date = fields[5] + ' ' + fields[6] + ' ' + fields[7]
      log.app = fields[8]
      logs.push(log)
    }
  }
  return logs
}

const gameName = (res) => {
  let name = ''
  if (res.gameName) {
    name = res.gameName
  } else if (res.name) {
    name = res.name
  } else if (res.organisation) {
    name = res.organisation
  }
  return name
}

module.exports = {

  saveData: function(io) {

    let nodes, logs, mongo
    try {
      nodes = execSync(`ps -ef | grep node | grep -v grep`).toString()
    } catch(e) {
      nodes = ''
    }
    try {
      logs = execSync("ls -l /usr/apps/logs").toString()
    } catch(e) {
      logs = ''
    }
    try {
      execSync(`ps -ef | grep mongo | grep -v grep`).toString()
      mongo = true
    } catch(e) {
      mongo = false
    }

    nodes = parseProcesses(nodes)
    logs = parseLogs(logs)

    io.emit('updateProcesses', nodes)
    io.emit('updateMongo', mongo)
    io.emit('updateLogs', logs)
  },

  getGames: function(db, io) {

    const games = [
      {game: 'Agile Battleships', collection: 'battleships'},
      {game: 'Coin Game', collection: 'coinGame'},
      {game: 'L-EAF Test App', collection: 'leafTestOrganisations'},
      {game: 'No Estimates', collection: 'noEstimatesGames'},
      {game: 'No Estimates New', collection: 'noEstimatesNewGames'},
      {game: 'Planning Poker', collection: 'planningPokerOrganisations'},
      {game: 'Survival At Sea', collection: 'survival'}
    ]

    for (let i = 0; i < games.length; i++) {
      const game = games[i]
      db.collection(game.collection).find().toArray((err, res) => {
        if (err) throw err
        if (res.length) {
          let lastaccess, lastaccessGame, created, createdGame
          for (let i = 0; i < res.length; i++) {
            if (res[i].lastaccess) {
              if (!lastaccess) {
                lastaccess = res[i].lastaccess
                lastaccessGame = gameName(res[i])
              } else if (res[i].lastaccess > lastaccess) {
                lastaccess = res[i].lastaccess
                lastaccessGame = gameName(res[i])
              }
            }
            if (res[i].created) {
              if (!created) {
                created = res[i].created
                createdGame = gameName(res[i])
              } else if (res[i].created > created) {
                created = res[i].created
                createdGame = gameName(res[i])
              }
            }
          }
          game.lastaccess = lastaccess
          game.lastaccessGame = lastaccessGame
          game.created = created
          game.createdGame = createdGame
          game.games = res.length
          io.emit('updateGames', game)
        }
      })
    }
  },

  getOutdated: function(io) {
    const updated = fs.readFileSync('/usr/apps/monitor/outdated.txt', 'utf8')
    io.emit('updateOutdated', JSON.parse(updated))
    this.saveData(io)
  },

  getConnections: function(db, io) {

    const admin = db.admin()
    admin.serverStatus((err, res) => {
      if (err) throw err;
      io.emit('updateMongoConnections', res.connections)
    })
  },

  getLog: function(io, data) {

    fs.readFile('/usr/apps/logs/' + data.app, 'utf8', (err, log) => {
      if (err) throw err;
      data.log = log
      io.emit('getLog', data)
    })
  },

  deleteLog: function(data) {

    execSync("rm /usr/apps/logs/" + data.app)
  },

  loadAssessments: function(db, io) {
    let i, j
    const results = {}
    db.collection('fiveDysfunctionsAssessments').find().toArray(function(err, fiveDysfunctions) {
      if (err) throw err;
      const results = []
      for (i = 0; i < fiveDysfunctions.length; i++) {
        for (j = 0; j < fiveDysfunctions[i].resultsEmailled.length; j++) {
          results.push(fiveDysfunctions[i].resultsEmailled[j])
        }
      }
      io.emit('loadAssessments', {type: 'fiveDysfuntions', results: results})
    })
    db.collection('healthCheckAssessments').find().toArray(function(err, healthChecks) {
      if (err) throw err;
      const results = []
      for (i = 0; i < healthChecks.length; i++) {
        for (j = 0; j < healthChecks[i].resultsEmailled.length; j++) {
          results.push(healthChecks[i].resultsEmailled[j])
        }
      }
      io.emit('loadAssessments', {type: 'healthCheck', results: results})
    })
  }

}
