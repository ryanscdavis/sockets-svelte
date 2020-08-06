
const { v4: uuid } = require('uuid')

class Connections {

    constructor () {

        this.connections = new Map()
        this.interval = setInterval(this._sweep.bind(this), 10000)

    }

    add (ctx) {

        const reqId = uuid()

        this.connections.set(reqId, ctx)

        ctx.req.on('close', this._remove.bind(this, reqId))
        ctx.req.on('error', this._remove.bind(this, reqId))
        ctx.req.on('finish', this._remove.bind(this, reqId))

        console.log('Connections: ', this.connections.size)

    }

    send(chat, event) {

        this.connections.forEach(ctx => {
            const data = event.getData()
            if (ctx.params.chat === chat) ctx.body.write({ id: data.sk, event: data.evt, data: data })
        })

    }

    destroy () {
        this.connections.forEach(conn => conn.res.end())
        this.connections.clear()
        clearInterval(this.interval)
    }

    _remove (reqId) {

        if (this.connections.has(reqId)) {
            this.connections.get(reqId).res.end()
            this.connections.delete(reqId)
            console.log('Connections: ', this.connections.size)
        }

    }

    _sweep () {

        this.connections.forEach(conn => conn.body.ping())

    }

}

module.exports = new Connections()