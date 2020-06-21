
const KoaRouter = require('@koa/router')
const DynamoApi = require('./DynamoApi.js')


const router = new KoaRouter()
const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

router.get('/api', ctx => {
    ctx.body = 'OK'
})

router.get('/api/chats/:chat', async ctx => {
    console.log('get')
    ctx.body = await db.latestMessages({ chat: ctx.params.chat })
})

module.exports = router