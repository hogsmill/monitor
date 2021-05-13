const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'

ON_DEATH((signal, err) => {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, (err) => {
    if (err) console.log(logStr)
    process.exit()
  })
})

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

var dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ?  'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const maxIdleTime = 6000
const connectDebugOff = prod

var connections = 0
var maxConnections = 10

const getGames = () => {
  let games = [
    {game: 'Agile Battleships', collection: 'battleships'},
    {game: 'Coin Game', collection: 'coinGame'},
    {game: 'Kanban', collection: 'kanbanGames'},
    {game: 'L-EAF Test App', collection: 'leafTestOrganisations'},
    {game: 'No Estimates', collection: 'noEstimatesGames'},
    {game: 'No Estimates New', collection: 'noEstimatesNewGames'},
    {game: 'Planning Poker', collection: 'planningPokerOrganisations'},
    {game: 'Survival At Sea', collection: 'survival'}
  ]
  MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, (err, client) => {
    for (let i = 0; i < games.length; i++) {
      if (err) throw err
      const db = client.db('db')
      dbStore.getGames(db, io, games[i])
    }
  })
}

const getConnections = () => {
  MongoClient.connect(url, { useUnifiedTopology: true, maxIdleTimeMS: maxIdleTime }, (err, client) => {
    if (err) throw err
    const db = client.db('db')
    dbStore.getConnections(db, io)
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

  socket.on('sendLoad', () => { !prod || dbStore.saveData(io) })

  socket.on('sendGetGames', () => { getGames() })

  socket.on('sendGetOutdated', () => { dbStore.getOutdated(io) })

  socket.on('sendGetConnections', () => { getConnections() })

  socket.on('sendGetLog', (data) => { !prod || dbStore.getLog(io, data) })

  socket.on('sendDeleteLog', (data) => { dbStore.deleteLog(data) })
});

var port = process.argv[2] || 3012

httpServer.listen(port, () => {
  console.log("Listening on *:" + port);
});
