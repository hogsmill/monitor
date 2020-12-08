const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

var dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'

const connectDebugOff = prod
const debugOn = !prod

var connections = 0
var maxConnections = 10

function emit(event, data) {
  if (debugOn) {
    console.log(event, data);
  }
  io.emit(event, data)
}

function getGames() {
  let games = [
    {game: 'Agile Battleships', collection: 'battleships'},
    {game: 'Coin Game', collection: 'coinGame'},
    {game: 'Kanban', collection: 'kanbanGames'},
    {game: 'No Estimates', collection: 'noEstimatesGames'},
    {game: 'Planning Poker', collection: 'planningPokerOrganisations'},
    {game: 'Survival At Sea', collection: 'survival'}
  ]
  for (let i = 0; i < games.length; i++) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      if (err) throw err
      const db = client.db('db')
      dbStore.getGames(err, client, db, io, games[i], debugOn)
    })
  }
}

function getConnections(fun, data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db('db')
    dbStore.getConnections(err, client, db, io, data, debugOn)
  })
}

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

  //socket.on('load', () => { dbStore.saveData(debugOn, io) })

  socket.on('getGames', () => { getGames() })

  socket.on('getConnections', () => { getConnections() })

//  socket.on('getLog', (data) => { dbStore.getLog(debugOn, io, data) })

//  socket.on('deleteLog', (data) => { dbStore.deleteLog(debugOn, io, data) })
});

var port = process.argv[2] || 3012

http.listen(port, () => {
  console.log("Listening on *:" + port);
});
