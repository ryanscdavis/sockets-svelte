
const KoaRouter = require('@koa/router')
const DynamoApi = require('./DynamoApi.js')

const { PassThrough } = require('stream')
const SSEtransform = require('./SSEtransform.js')
const Event = require('./Event.js')

const NotificationService = require('./NotificationService.js')


const router = new KoaRouter()
const db = new DynamoApi({ tableName: 'Messages2', region: 'us-east-1' })

router.get('/api', ctx => {
    ctx.body = 'OK'
})

router.get('/api/:chat/friends', async ctx => {

    const chat = ctx.params.chat
    const friends = await db.getFriendList({ chat })
    console.log({ chat, friends });
    ctx.body = friends

})

router.post('/api/subscriptions', ctx => {
    NotificationService.subscribe(ctx.request.body)
    ctx.status = 200
})

router.post('/api/:chat/events', async ctx => {

    console.log('request post event')
    const chat = ctx.params.chat
    const ts = (new Date()).toISOString()

    const data = Object.assign(ctx.request.body, { chat, ts })
    console.log(data);

    try {
        const event = new Event(data)
        await db.writeEvent(event)
        ctx.status = 201
    }
    catch (error) {
        ctx.status = 500
    }

})

router.get('/api/events/:chat', async ctx => {

    const chat = ctx.params.chat

    console.log('events request: ', chat)

    ctx.set('Content-Type', 'text/event-stream')
    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Connection', 'keep-alive')

    ctx.body = new SSEtransform()

    // TODO: check for last-event-id

    // get first items
    let [ events, lastKey ] = await db.getEvents({ chat })
    events.forEach(e => ctx.body.write({ id: e.sk, data: e }) )

    // get remaining items
    while (lastKey) {
        [ events, lastKey ] = await db.getEvents({ chat, lastKey })
        events.forEach(e => ctx.body.write({ id: e.sk, data: e }) )
    }

    // TODO: save ctx

})


module.exports = router