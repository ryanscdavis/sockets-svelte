
const KoaRouter = require('@koa/router')
const DynamoApi = require('./DynamoApi.js')

const { PassThrough } = require('stream')
const SSEtransform = require('./SSEtransform.js')
const Connections = require('./Connections.js')

const NotificationService = require('./NotificationService.js')


const router = new KoaRouter()
const db = new DynamoApi({ tableName: 'Messages2', region: 'us-east-1' })

router.get('/api', ctx => {
    ctx.body = 'OK'
})

router.post('/api/:chat/events', async ctx => {

    console.log('request post event')

    const chat = ctx.params.chat
    const ts = (new Date()).toISOString()

    const data = Object.assign(ctx.request.body, { chat, ts })

    try {
        const event = await db.createEvent(data)
        console.log('event created')
        Connections.send(chat, event)
        ctx.status = 201
    }
    catch (error) {
        console.error(error)
        ctx.status = 500
    }

})

router.get('/api/:chat/events', async ctx => {

    let lastKey
    let events
    const chat = ctx.params.chat

    console.log('events request: ', chat)

    ctx.set('Content-Type', 'text/event-stream')
    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Connection', 'keep-alive')

    ctx.body = new SSEtransform()

    // check if this is a reconnect
    if ('last-event-id' in ctx.headers) {
        const sk = ctx.headers['last-event-id']
        const pk = `CHAT#${chat}`
        lastKey = { pk, sk }
    }
    else {
        lastKey = null
    }

    // get first items
    [ events, lastKey ] = await db.getEvents({ chat, lastKey })
    events.forEach(e => ctx.body.write({ id: e.sk, event: e.evt, data: e }) )

    // get remaining items
    while (lastKey) {
        [ events, lastKey ] = await db.getEvents({ chat, lastKey })
        events.forEach(e => ctx.body.write({ id: e.sk, event: e.evt, data: e }) )
    }

    Connections.add(ctx)

})


module.exports = router