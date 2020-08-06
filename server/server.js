
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

