
const AWS = require('aws-sdk')

class DynamoApi {


    constructor({ tableName, region }) {
        this.tableName = tableName
        this.region = region
    }


    // add a message to the database
    async putMessage ({ chat, usr, txt }) {

        const promise = new Promise((resolve, reject) => {

            const documentClient = new AWS.DynamoDB.DocumentClient({
                'region': this.region
            })

            const ts = (new Date()).toISOString()
            const pk = `CHAT#${chat}`
            const sk = `TS#${ts}#USR#${usr}`

            const params = {
                TableName: this.tableName,
                Item: { pk, sk, ts, usr, txt }
            }

            const callback = (err, data) => {
                if (err) reject(err)
                else resolve(data)
            }

            documentClient.put(params, callback)

        })

        return promise

    }

    // returns the last 50 messages
    // if chat does not exist, returns empty array
    async latestMessages ({ chat }) {

        const promise = new Promise((resolve, reject) => {

            const documentClient = new AWS.DynamoDB.DocumentClient({
                'region': this.region
            })

            const pk = `CHAT#${chat}`

            const params = {
                TableName: this.tableName,
                KeyConditionExpression: 'pk = :pk and begins_with(sk, :ts)',
                ExpressionAttributeValues: { ':pk': pk, ':ts': 'TS#' },
                ProjectionExpression: 'ts, usr, txt',   // only return these keys
                ScanIndexForward: false,
                Limit: 50
            }

            const callback = (err, data) => {
                if (err) reject(err)
                else resolve(data.Items)
            }

            documentClient.query(params, callback)

        })

        return promise

    }

    // add or replace a subscription
    async putSubscription ({ chat, subscription, active }) {

        const { endpoint } = subscription

        const promise = new Promise((resolve, reject) => {

            const documentClient = new AWS.DynamoDB.DocumentClient({
                'region': this.region
            })

            const pk = `CHAT#${chat}`
            const sk = `SUB#${endpoint}`

            const params = {
                TableName: this.tableName,
                Item: { pk, sk, subscription, active }
            }

            const callback = (err, data) => {
                if (err) reject(err)
                else resolve(data)
            }

            documentClient.put(params, callback)

        })

        return promise

    }

    // returns a list of active subscriptions for a chat
    async getActiveChatSubscriptions ({ chat }) {

        const promise = new Promise((resolve, reject) => {

            const documentClient = new AWS.DynamoDB.DocumentClient({
                'region': this.region
            })

            const pk = `CHAT#${chat}`

            const params = {
                TableName: this.tableName,
                KeyConditionExpression: 'pk = :pk and begins_with(sk, :sub)',
                ExpressionAttributeValues: { ':pk': pk, ':sub': 'SUB#' },
                ProjectionExpression: 'subscription, active',   // only return these keys
                ScanIndexForward: false,
                Limit: 50
            }

            const callback = (err, data) => {
                if (err) reject(err)
                else {
                    const active = data.Items.filter(item => item.active).map(item => item.subscription)
                    resolve(active)
                }
            }

            documentClient.query(params, callback)

        })

        return promise

    }

}

module.exports = DynamoApi