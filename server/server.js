
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

    console.log('connected')
    console.log(socket.request._query.hash)
    const hash = socket.request._query.hash

    socket.join(hash)

    socket.on('join', obj => {
        io.to(hash).emit('join', obj)
    })

    socket.on('msg', async msg => {
        io.to(hash).emit('msg', msg)
        db.putMessage({ chat: hash, usr: msg.usr, txt: msg.txt })
    })

    let messages = await db.latestMessages({ chat: hash })

    socket.emit('welcome', messages)

})
