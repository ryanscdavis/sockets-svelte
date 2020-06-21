
const Koa = require('koa')
const http = require('http')
const socketio = require('socket.io')
const KoaStatic = require('koa-static')
const KoaRouter = require('@koa/router')

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

    console.log('someone connected')

    socket.on('join', obj => {
        console.log('someone joined', obj)
        io.emit('join', obj)
    })

    socket.on('msg', async msg => {
        io.emit('msg', msg)
        db.putMessage({ chat: 'root', usr: msg.usr, txt: msg.txt })
    })

    let messages = await db.latestMessages({ chat: 'root' })

    socket.emit('welcome', messages)

})
