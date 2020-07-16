
const http = require('http')
const urlParse = require('url-parse')

const KoaStatic = require('koa-static')

const Koa = require('koa')
const KoaRouter = require('@koa/router')

const DynamoApi = require('./DynamoApi.js')
const Router = require('./router.js')
const SocketServer = require('./SocketServer.js')

const root = './public'
const port = process.env.PORT || 8000
const app = new Koa()
const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

const chats = new Map()

app.use(Router.routes())
app.use(KoaStatic(root, {}))

const server = http.createServer(app.callback()).listen(port, () => {
    console.log(`Server listening on port ${port}!`)
})

const socketServer = new SocketServer(server)

const sockets = new Map()

socketServer.on('connection', async (ws, req) => {

    console.log('connection')

    const query = urlParse(req.url, true).query
    const chat = query['chat']

    if (sockets.has(chat)) {
        sockets.get(chat).add(ws)
    }
    else {
        sockets.set(chat, new Set([ws]))
    }

    ws.on('close', () => {
        const chatroom = sockets.get(chat)
        chatroom.delete(ws)
        if (chatroom.size === 0) sockets.delete(chat)
    })

    const messages = await db.latestMessages({ chat })

    if (ws.connected) {
        ws.send(JSON.stringify({ event: 'messages', data: messages }))
    }

})

socketServer.on('message', data => {

    const { usr, txt, chat } = data
    const message = JSON.stringify({ event: 'message', data })
    sockets.get(chat).forEach(ws => ws.send(message))

})


// async function handleJoinEvent (ws, data) {
//     const chat = data['chat']
//     const messages = await db.latestMessages({ chat })
//     const response = JSON.stringify({ event: 'messages', data: { messages } })
//     ws.send(response)
//     ws.isAlive = true
//     if (chats.has(chat)) chats.get(chat).push(ws)
//     else chats.set(chat, [ws])
// }

// async function handleMessageEvent (ws, data) {
//     const { chat, usr, txt } = data
//     const response = await db.putMessage({ chat, usr, txt })
//     const message = JSON.stringify({ event: 'message', data })
//     chats.get(chat).forEach(socket => socket.send(message))
// }

// function handlePong(ws) {
//     ws.isAlive = true
// }

// wss.on('connection', function (ws) {

//     console.log('connection made')

//     ws.on('message', async function (message) {

//         const { event, data } = JSON.parse(message)

//         console.log(new Date(), event)

//         if (event === 'join')
//             handleJoinEvent(ws, data)
//         else if (event === 'message')
//             handleMessageEvent(ws, data)
//         else if (event === 'pong')
//             handlePong(ws)
//         else
//             console.error(event)

//     })

// })
