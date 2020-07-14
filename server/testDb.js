
const DynamoApi = require('./DynamoApi.js')

const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

db.latestMessages({ chat: 'chatbox' }).then(console.log)