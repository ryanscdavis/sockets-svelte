
const http = require('http')
const WebSocket = require('ws')
const KoaStatic = require('koa-static')

const Koa = require('koa')
const KoaRouter = require('@koa/router')

const DynamoApi = require('./DynamoApi.js')
const Router = require('./router.js')

const root = './public'
const port = process.env.PORT || 8000
const app = new Koa()
const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

const chats = new Map()

app.use(Router.routes())
app.use(KoaStatic(root, {}))

const server = http.createServer(app.callback()).listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

const wss = new WebSocket.Server({ server })


wss.on('connection', function (ws) {

    console.log('connection made')

    ws.on('message', async function (data) {

        console.log('server received message')

        const json = JSON.parse(data)
        const event = json['event']

        if (event === 'join') {
            console.log({ event })
            const chat = json['chat']
            console.log('fetching latest messages for: ', chat)
            const messages = await db.latestMessages({ chat })
            console.log('received messages from db, responding to client', messages.length)
            const response = { event: 'messages', messages }
            ws.send(JSON.stringify(response))

            if (chats.has(chat)) chats.get(chat).push(ws)
            else chats.set(chat, [ws])
        }

        if (event === 'message') {

            const { chat, usr, txt } = json['message']

            try {
                console.log('persisting to database', { chat, usr, txt })
                const response = await db.putMessage({ chat, usr, txt })
                console.log('data saved')
                console.log(response)
            } catch (error) {
                console.log('oops there was an error')
                console.log(error)
            }

            chats.get(chat).forEach(socket => {
                socket.send(data)
            })
        }

    })

})