
const DynamoApi = require('./DynamoApi.js')

const db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })

// db.latestMessages({ chat: 'chatbox' }).then(console.log)

const chat = 'chatbox'
const active = false
const subscription = { endpoint: 'https://somewhere.com/ep', keys: {} }


async function test () {
    await db.putSubscription ({ chat, subscription, active })
    db.getActiveChatSubscriptions({ chat: 'chatbox' }).then(console.log)
}


test()