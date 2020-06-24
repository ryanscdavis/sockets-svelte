
const Koa = require('koa')
const http = require('http')
const socketio = require('socket.io')
const KoaStatic = require('koa-static')
const KoaRouter = require('@koa/router')
const url = require('url')
const DynamoApi = require('./DynamoApi.js')
const Router = require('./router.js')

const root = './public'
const port = process.env.PORT || 8000
const app = new Koa()
const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

app.use(Router.routes())
app.use(KoaStatic(root, {}))

const server = http.createServer(app.callback()).listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

const io = socketio(server)


io.on('connection', async socket => {

    const chat = socket.request._query.chat
    console.log('connected from chat: ', chat)

    socket.join(chat)

    socket.on('join', obj => {
        io.to(chat).emit('join', obj)
    })

    socket.on('msg', async msg => {
        console.log('received message')
        io.to(chat).emit('msg', msg)
        db.putMessage(msg).then(res => {
            console.log('successfully wrote message to db')
        })
    })

    console.log('query db for messages in chat: ', chat)
    let messages = await db.latestMessages({ chat })
    console.log(`Found ${messages.length} messages`)
    socket.emit('welcome', messages)

})
