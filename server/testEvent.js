
const Event = require('./Event.js')
const DynamoApi = require('./DynamoApi.js')

const create = new Event({
    chat: 'chatbox',
    evt: 'crt',
    usr: 'ryan',
    ts: (new Date()).toISOString()
})

const add = new Event({
    chat: 'chatbox',
    evt: 'add',
    usr: 'ryan',
    ts: (new Date()).toISOString(),
    add: 1
})

const msg1 = new Event({
    chat: 'chatbox',
    evt: 'msg',
    usr: 'ryan',
    ts: (new Date()).toISOString(),
    txt: 'hello world!'
})

async function test () {

    const db = new DynamoApi({ tableName: 'test', region: 'us-east-1' })

    await db.writeEvent(create)
    await db.writeEvent(add)

    await db.writeEvent(msg1)

    const msgs = await db.latestMessages({ chat: 'chatbox' })
    console.log(msgs)

}

test()