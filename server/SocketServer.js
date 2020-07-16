
const EventEmitter = require('events')
const WebSocket = require('ws')

class SocketServer extends EventEmitter {

    constructor (server) {

        // call super class EventEmitter
        super()

        // create web socket server with hooks
        this.wss = new WebSocket.Server({ server })
        this.wss.on('connection', this.onConnection.bind(this))

        // start the heartbeat
        this.interval = setInterval(this.heartbeat.bind(this), 5000)

    }

    onConnection (ws, req) {

        const ip = req.socket.remoteAddress

        // bind message handler
        ws.on('message', this.onMessage.bind(this, ws))

        // start the heartbeat
        ws.isAlive = true
        ws.connected = true

        // execute event listeners
        this.emit('connection', ws, req)

    }

    onMessage (ws, message) {

        const { event, data } = JSON.parse(message)

        console.log(event)

        if (event === 'pong') {
            ws.isAlive = true;
        }
        else {
            this.emit(event, data)
        }

    }

    heartbeat () {

        console.log('heartbeat', this.wss.clients.size)

        const ping = JSON.stringify({ event: 'ping' })

        this.wss.clients.forEach(ws => {

            if (ws.isAlive === false) {
                ws.connected = false
                return ws.terminate()
            }

            ws.isAlive = false

            ws.send(ping)

        })

    }

    send (ws, event, data) {
        ws.send(JSON.stringify({ event, data }))
    }

}

module.exports = SocketServer