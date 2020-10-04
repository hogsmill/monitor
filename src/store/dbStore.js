
function state() {
  return {
    3000: {port: 3000, app: 'coin-game', running: false},
    3001: {port: 3001, app: 'do-others-work-first-js', running: false},
    3002: {port: 3002, app: 'pairing', running: false},
    3003: {port: 3003, app: 'context-switching', running: false},
    3004: {port: 3004, app: 'lego-flow', running: false},
    3005: {port: 3005, app: 'mastermind', running: false},
    3006: {port: 3006, app: 'health-check', running: false},
    3007: {port: 3007, app: 'no-estimates', running: false},
    3008: {port: 3008, app: 'battleships', running: false},
    3009: {port: 3009, app: 'change-management-game', running: false},
    3010: {port: 3010, app: 'pig-racing', running: false},
    3011: {port: 3011, app: 'survival', running: false},
    3012: {port: 3012, app: 'monitor', running: false}
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
  return splitData = data.split("\n")
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
