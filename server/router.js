
const KoaRouter = require('@koa/router')
const DynamoApi = require('./DynamoApi.js')
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


module.exports = router