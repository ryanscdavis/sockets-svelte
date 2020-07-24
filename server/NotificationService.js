
const webpush = require('web-push')
const DynamoApi = require('./DynamoApi.js')

class NotificationService {

    constructor () {
        this.count = 0                  // number of subscriptions
        this.subscriptions = new Map()  // subscriptions[chat][endpoing] -> subscription
        this.db = new DynamoApi({ tableName: 'Messages', region: 'us-east-1' })
    }

    async subscribe (subscriptionMessage) {

        const active = true
        const { chat, subscription } = subscriptionMessage
        // await this.db.putSubscription({ chat, subscription, active })
        // console.log('created subscription')
    }

    async notify (msg) {

        const { chat, usr, txt } = msg

        const publicKey = 'BItBeVu11iDisfoYJSmu3NnMADSeGo01PkDJKmIyiDLkYoFYl6_LGNm6rU9FDY1BDopX8Pt9Ykh46N8eR_qcbBg'
        const privateKey = 'Cjtq1miwAV-GP32d7SL--cPt8yi40wA9OHDQytt0k3E'

        webpush.setVapidDetails('mailto:ryanscdavis@gmail.com', publicKey, privateKey)

        // const subs = await this.db.getActiveChatSubscriptions({ chat })
        const subs = []

        const data = JSON.stringify({ chat, usr, txt })

        subs.forEach(sub => {
            webpush.sendNotification(sub, data)
                .then(() => console.log('notification sent'))
                .catch(err => console.error(err))
        })

    }

}

module.exports = new NotificationService()