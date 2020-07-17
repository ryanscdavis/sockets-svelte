
const KoaRouter = require('@koa/router')
const DynamoApi = require('./DynamoApi.js')
const NotificationService = require('./NotificationService.js')


const router = new KoaRouter()
const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

router.get('/api', ctx => {
    ctx.body = 'OK'
})

router.post('/api/subscriptions', ctx => {
    NotificationService.subscribe(ctx.request.body)
    ctx.status = 200
})


module.exports = router