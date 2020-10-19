
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
