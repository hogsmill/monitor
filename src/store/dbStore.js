
const execSync = require('child_process').execSync;

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
    3012: {port: 3012, app: 'monitor', running: false, keep: true}
  }
}

function parseProcesses(data) {
  let processes = state()
  const splitData = data.split("\n")
  for (let i = 0; i < splitData.length; i++) {
    if (splitData[i].match(/server.js/)) {
      const fields = splitData[i].split(/server.js/)[1]
      const port = fields.substr(1, 4)
      if (!processes[port]) {
        processes[port] = {}
      }
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
      if (!keeps[port]) {
        keeps[port] = {}
      }
      keeps[port].running = true
    }
  }
  return keeps
}

function parseLogs(data) {
  let logs = []
  const splitData = data.split("\n")
  for (let i = 0; i < splitData.length; i++) {
    if (splitData[i].match(/root root/) && splitData[i].match(/server.log/)) {
      let log = {}

      // Format: -rw-r--r-- 1 root root  47 Oct 14 11:07 /usr/apps/battleships/server.log

      const fields = splitData[i].split (/\s+/)
      log.size = fields[4]
      log.date = fields[5] + ' ' + fields[6] + ' ' + fields[7]
      let app = fields[8].split('/')
      log.app = app[3]
      logs.push(log)
    }
  }
  return logs
}

module.exports = {

  saveData: function(debugOn) {

    const nodes = execSync(`ps -ef | grep node`).toString()
    const keeps = execSync(`ps -ef | grep keep`).toString()
    const logs = execSync("ls -l /usr/apps/\*/server.log").toString()

    if (debugOn) { console.log('saveData', node, keeps, logs) }

    nodes = parseProcesses(node)
    keeps = parseKeeps(keeps)
    logs = parseLogs(logs)

    io.emit('updateProcesses', nodes)
    io.emit('updateKeeps', keeps)
    io.emit('updateLogs', logs)
  }

}
