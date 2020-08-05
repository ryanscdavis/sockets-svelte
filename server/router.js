
const KoaRouter = require('@koa/router')
const DynamoApi = require('./DynamoApi.js')

const { PassThrough } = require('stream')
const SSEtransform = require('./SSEtransform.js')

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

})


module.exports = router