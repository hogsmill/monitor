const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})

ON_DEATH(function(signal, err) {
  let logStr = new Date() + ' ' + signal + '\n'
  if (err && err.stack) {
    logStr = '  ' + err.stack + '\n'
  }
  fs.appendFile('server.log', logStr, function (err) {
    if (err) console.log(err)
    process.exit()
  })
})

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const os = require('os')
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

var dbStore = require('./store/dbStore.js')

var MongoClient = require('mongodb').MongoClient;

var prod = os.hostname() == "agilesimulations" ? true : false
var url = prod ?  "mongodb://127.0.0.1:27017/" : "mongodb://localhost:27017/"

var connectDebugOff = prod
var debugOn = !prod

var connections = 0
var maxConnections = 10

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

function saveData(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.saveData(err, client, db, io, data, debugOn)
  })
}

/*
function saveProcesses(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.saveProcesses(err, client, db, io, data, debugOn)
  })
}

function saveKeeps(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.saveKeeps(err, client, db, io, data, debugOn)
  })
}

function saveLogs(data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    var db = client.db('db');
    dbStore.saveLogs(err, client, db, io, data, debugOn)
  })
}
*/

io.on("connection", (socket) => {
  connections = connections + 1
  if (connections > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id}. (${connections} connections)`)
  }

  socket.on("disconnect", () => {
    connections = connections - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected. (${connections} connections)`)
  })

  setInterval(function() {
    let data = {}
    execSync('ps -ef | grep node', function(error, stdout, stderr) {
      data.node = stdout
      //saveProcesses(stdout)
    })
    execSync('ps -ef | grep keep', function(error, stdout, stderr) {
      data.keeps = stdout
      //saveKeeps(stdout)
    })
    execSync('ls -l ../*/server.log', function(error, stdout, stderr) {
      data.logs = stdout
      //saveLogs(stdout)
    })
    console.log(data)
    saveData(data)
    emit('updateLastUpdated', new Date().toGMTString())
  }, 10000)

});

var port = process.argv[2] || 3012

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
