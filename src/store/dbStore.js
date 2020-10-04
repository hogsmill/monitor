
function state() {
  return {
    3000: {port: 3000, app: 'coin-game', running: false, keep: true},
    3001: {port: 3001, app: 'do-others-work-first-js', running: false, keep: false},
    3002: {port: 3002, app: 'pairing', running: false, keep: false},
    3003: {port: 3003, app: 'context-switching', running: false, keep: true},
    3004: {port: 3004, app: 'lego-flow', running: false, keep: false},
    3005: {port: 3005, app: 'mastermind', running: false, keep: false},
    3006: {port: 3006, app: 'health-check', running: false, keep: false},
    3007: {port: 3007, app: 'no-estimates', running: false, keep: true},
    3008: {port: 3008, app: 'battleships', running: false, keep: true},
    3009: {port: 3009, app: 'change-management-game', running: false, keep: false},
    3010: {port: 3010, app: 'pig-racing', running: false, keep: false},
    3011: {port: 3011, app: 'survival', running: false, keep: true},
    3012: {port: 3012, app: 'monitor', running: false, keep: false}
  }
}

function parseProcesses(data) {
  let processes = state()
  const splitData = data.split("\n")
  for (let i = 0; i < splitData.length; i++) {
    if (splitData[i].match(/server.js/)) {
      const fields = splitData[i].split(/server.js/)[1]
      const port = fields.substr(1, 4)
      processes[port].running = true
    }
  }
  return processes
}

function parseKeeps(data) {
  let keeps = state()
  const splitData = data.split("\n")
  for (let i = 0; i < splitData.length; i++) {
    if (splitData[i].match(/keep.sh/)) {
      const fields = splitData[i].split(/keep.sh/)[1]
      const port = fields.substr(1, 4)
      keeps[port].running = true
    }
  }
  return keeps
}

function parseLogs(data) {
  let logs = []
  const splitData = data.split("\n")
  for (let i = 0; i < splitData.length; i++) {
    if (splitData[i].match(/server.log/)) {
      let log = {}
      const fields = splitData[i].split (' ')
      log.size = fields[4]
      log.date = fields[5] + ' ' + fields[7] + ' ' + fields[8]
      let app = fields[9].split('/')
      log.app = app[1]
      logs.push(log)
    }
  }
  return logs
}

module.exports = {

  saveProcesses: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('saveProcesses') }

    const processes = parseProcesses(data)
    io.emit('updateProcesses', processes)
    //db.collection('monitor').insertOne({gameName: data.gameName}, function(err, res) {
    //  if (err) throw err;
    //})
  },

  saveKeeps: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('saveKeeps') }

    const keeps = parseKeeps(data)
    io.emit('updateKeeps', keeps)
    //db.collection('monitor').insertOne({gameName: data.gameName}, function(err, res) {
    //  if (err) throw err;
    //})
  },

  saveLogs: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('saveLogs') }

    const keeps = parseLogs(data)
    io.emit('updateLogs', keeps)
    //db.collection('monitor').insertOne({gameName: data.gameName}, function(err, res) {
    //  if (err) throw err;
    //})
  }

}
