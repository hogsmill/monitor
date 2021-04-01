import io from 'socket.io-client'
import bus from './EventBus'

let connStr
if (location.hostname == 'localhost') {
  connStr = 'http://localhost:3012'
} else {
  connStr = 'https://agilesimulations.co.uk:3012'
}
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// Send

bus.$on('sendLoad', (data) => { socket.emit('sendLoad', data) })

bus.$on('sendGetGames', (data) => { socket.emit('sendGetGames', data) })

bus.$on('sendGetOutdated', (data) => { socket.emit('sendGetOutdated', data) })

bus.$on('sendGetConnections', (data) => { socket.emit('sendGetConnections', data) })

bus.$on('sendGetLog', (data) => { socket.emit('sendGetLog', data) })

bus.$on('sendDeleteLog', (data) => { socket.emit('sendDeleteLog', data) })

// Receive

socket.on('updateProcesses', (data) => { bus.$emit('updateProcesses', data) })

socket.on('updateMongo', (data) => { bus.$emit('updateMongo', data) })

socket.on('updateMongoConnections', (data) => { bus.$emit('updateMongoConnections', data) })

socket.on('updateGames', (data) => { bus.$emit('updateGames', data) })

socket.on('updateOutdated', (data) => { console.log('HERE'); bus.$emit('updateOutdated', data) })

socket.on('updateLogs', (data) => { bus.$emit('updateLogs', data) })

socket.on('getLog', (data) => { bus.$emit('getLog', data) })

export default bus
