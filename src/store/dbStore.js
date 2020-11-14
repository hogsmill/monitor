
const execSync = require('child_process').execSync;
const fs = require('fs')

function state() {

  let apps = {}
  const data = fs.readFileSync('/usr/keep/apps.txt', 'utf8').split("\n")
  for (let i = 0; i < data.length; i++) {
    if (data[i].match(/^[0-9]{4}/)) {
      const fields = data[i].split(",")
      apps[fields[0]] = {
        port: fields[0],
        app: fields[1],
        name: fields[2]
      }
    }
  }
  return apps
}

function parseProcesses(data) {
  let processes = state()
  const splitData = data.split("\n")
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

function parseLogs(data) {
  let logs = []
  const splitData = data.split("\n")
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

module.exports = {

  saveData: function(debugOn, io) {

    let nodes = execSync(`ps -ef | grep node | grep -v grep`).toString()
    let logs = execSync("ls -l /usr/apps/logs").toString()

    let mongo
    try {
      execSync(`ps -ef | grep mongo | grep -v grep`).toString()
      mongo = true
    } catch(e) {
      mongo = false
    }

    if (debugOn) { console.log('saveData', nodes, logs, mongo) }

    nodes = parseProcesses(nodes)
    logs = parseLogs(logs)

    io.emit('updateProcesses', nodes)
    io.emit('updateMongo', mongo)
    io.emit('updateLogs', logs)
  },

  getGames: function(err, client, db, io, data, debugOn) {

    db.collection(data.collection).find({}, {$sort : {created: -1} }).toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        data.newest = res[0].created
        data.games = res.length
        io.emit('updateGames', data)
        client.close()
      }
    })
  },

  getConnections: function(err, client, db, io, data, debugOn) {

    const admin = db.admin()
    const status = admin.serverStatus(function(err, res) {
      io.emit('updateMongoConnections', res.connections)
      client.close()
    })
  },

  getLog: function(debug, io, data) {

    fs.readFile('/usr/apps/logs/' + data.app, 'utf8', function(err, log) {
      if (err) throw err;
      data.log = log
      io.emit('getLog', data)
    })
  },

  deleteLog: function(debug, io, data) {

    execSync("rm /usr/apps/logs/" + data.app)
  }

}
