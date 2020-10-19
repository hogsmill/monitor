
const execSync = require('child_process').execSync;
const fs = require('fs')

function state() {

  let apps = {}
  const data = fs.readFileSync('/usr/keep/apps.txt', 'utf8').split("\n")
  for (let i = 0; i < data.length; i++) {
    const fields = data[i].split(",")
    apps[fields[0]] = {
      port: fields[0],
      app: fields[1],
      name: fields[2]
    }
  }

  return apps

  /*
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
  */
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

  saveData: function(debugOn, io) {

    let nodes = execSync(`ps -ef | grep node | grep -v grep`).toString()
    let logs = execSync("ls -l /usr/apps/\*/server.log").toString()

    let keep, mongo
    try {
      execSync(`ps -ef | grep keep | grep -v grep`).toString()
      keep = true
    } catch(e) {
      keep = false
    }
    try {
      execSync(`ps -ef | grep mongo | grep -v grep`).toString()
      mongo = true
    } catch(e) {
      mongo = false
    }

    if (debugOn) { console.log('saveData', nodes, keeps, logs) }

    nodes = parseProcesses(nodes)
    logs = parseLogs(logs)

    io.emit('updateProcesses', nodes)
    io.emit('updateKeep', keep)
    io.emit('updateMongo', mongo)
    io.emit('updateLogs', logs)
  }

}
