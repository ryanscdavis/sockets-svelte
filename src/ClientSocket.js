
import WebSocket from 'isomorphic-ws'


export default class ClientSocket {

    constructor(host, chat) {

        this.host = host
        this.chat = chat
        this.callbacks = {}
        this.connected = false
        this.interval = null

    }

    connect () {

        this.ws = new WebSocket(`wss://${this.host}?chat=${this.chat}`)

        this.ws.onopen      = this.onOpen.bind(this)
        this.ws.onmessage   = this.onMessage.bind(this)
        this.ws.onclose     = this.onClose.bind(this)

    }

    on (event, f) {
        this.callbacks[event] = f
    }

    send (event, data) {
        const message = JSON.stringify({ event, data })
        if (this.connected) {
            this.ws.send(message)
        }
    }

    onOpen () {
        console.log(new Date(), 'open')
        this.connected = true
    }

    onMessage (messageEvent) {

        const { event, data } = JSON.parse(messageEvent.data)

        console.log(new Date(), event)

        if (event === 'ping') {
            this.ws.send(JSON.stringify({ event: 'pong' }))
        }
        else if (event in this.callbacks) {
            this.callbacks[event](data)
        }
        else {
            console.warn('Event does not a handler:', event)
        }

    }

    onClose () {

        console.log(new Date(), 'socket closed try opening a new one every second')

        this.connected = false

        // use a timeout so that we are not looping open->close too much
        setTimeout(this.connect.bind(this), 1000)

    }

}