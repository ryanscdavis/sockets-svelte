
const http = require('http')
const urlParse = require('url-parse')

const KoaStatic = require('koa-static')

const Koa = require('koa')
const KoaRouter = require('@koa/router')
const KoaBodyParser = require('koa-bodyparser')
const DynamoApi = require('./DynamoApi.js')
const Router = require('./router.js')
const SocketServer = require('./SocketServer.js')
const NotificationService = require('./NotificationService.js')
const Event = require('./Event.js')

const root = './public'
const port = process.env.PORT || 8000
const app = new Koa()
const db = new DynamoApi({ tableName: 'Messages2', region: 'us-east-1' })

const chats = new Map()

app.use(KoaBodyParser())
app.use(Router.routes())
app.use(KoaStatic(root, {}))

const server = http.createServer(app.callback()).listen(port, () => {
    console.log(`Server listening on port ${port}!`)
})

// const socketServer = new SocketServer(server)

// const sockets = new Map()

// socketServer.on('connection', async (ws, req) => {

//     console.log('connection')

//     const query = urlParse(req.url, true).query
//     const chat = query['chat']
//     const usrId = query['usrId']

//     if (sockets.has(chat)) {
//         sockets.get(chat).add(ws)
//     }
//     else {
//         sockets.set(chat, new Set([ws]))
//     }

//     ws.on('close', () => {
//         const chatroom = sockets.get(chat)
//         chatroom.delete(ws)
//         if (chatroom.size === 0) sockets.delete(chat)
//     })

//     const events = await db.latestEvents({ chat })
//     console.log('Message from database for chat', chat, events.length)
//     if (ws.connected) {
//         ws.send(JSON.stringify({ event: 'messages', data: events }))
//     }

//     const friends = await db.getFriendList({ chat })
//     console.log('Fetched friends', friends.length)
//     if (ws.connected) {
//         ws.send(JSON.stringify({ event: 'friends', data: friends }))
//     }

// })

// socketServer.on('message', async data => {

//     const { chat, usr, txt } = data

//     const event = new Event({
//         chat: chat,
//         evt: 'msg',
//         usr: usr,
//         ts: (new Date()).toISOString(),
//         txt: txt
//     })

//     const response = await db.writeEvent(event)

//     // we need to wrap this event for the socket server
//     const message = {
//         event: 'message',
//         data: event.getData()
//     }

//     const json = JSON.stringify(message)
//     sockets.get(chat).forEach(ws => ws.send(json))
//     NotificationService.notify(data)

// })

// socketServer.on('add', async data => {

//     const { usrId, usr, chat } = data

//     const event = new Event({
//         chat: chat,
//         evt: 'add',
//         usrId: usrId,
//         usr: usr,
//         ts: (new Date()).toISOString(),
//         add: 1
//     })

//     const response = await db.writeEvent(event)

//     // we need to wrap this event for the socket server
//     const message = {
//         event: 'add',
//         data: event.getData()
//     }

//     const json = JSON.stringify(message)
//     sockets.get(chat).forEach(ws => ws.send(json))

// })

