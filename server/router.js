
const KoaRouter = require('@koa/router')
const DynamoApi = require('./DynamoApi.js')


const router = new KoaRouter()
const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

router.get('/api', ctx => {
    ctx.body = 'OK'
})



module.exports = router