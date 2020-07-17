
const webpush = require('web-push')

class NotificationService {

    constructor () {
        this.count = 0                  // number of subscriptions
        this.subscriptions = new Map()  // subscriptions[chat][endpoing] -> subscription
    }

    subscribe (subscriptionMessage) {

        const { chat, subscription } = subscriptionMessage
        const { endpoint } = subscription

        if (this.subscriptions.has(chat)) {
            const chatSubs = this.subscriptions.get(chat)
            if (chatSubs.has(endpoint) === false) { this.count += 1 }
            chatSubs.set(endpoint, subscription)
        }
        else {
            const m = new Map([[endpoint, subscription]])
            this.subscriptions.set(chat, m)
            this.count += 1
        }

        console.log('subscribe', this.count)

    }

    notify (msg) {

        const { chat, usr, txt } = msg

        const publicKey = 'BItBeVu11iDisfoYJSmu3NnMADSeGo01PkDJKmIyiDLkYoFYl6_LGNm6rU9FDY1BDopX8Pt9Ykh46N8eR_qcbBg'
        const privateKey = 'Cjtq1miwAV-GP32d7SL--cPt8yi40wA9OHDQytt0k3E'

        webpush.setVapidDetails('mailto:ryanscdavis@gmail.com', publicKey, privateKey)

        if (this.subscriptions.has(chat)) {

            const data = JSON.stringify({ chat, usr, txt })

            // send notification for every subscription in the chat
            this.subscriptions.get(chat).forEach((sub) => {
                webpush.sendNotification(sub, data)
                    .then(() => console.log('notification sent'))
                    .catch(err => console.error(err))
            })

        }

    }

}

module.exports = new NotificationService()