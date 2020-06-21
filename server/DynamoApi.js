
const AWS = require('aws-sdk')

class DynamoApi {


    constructor({ tableName, region }) {
        this.tableName = tableName
        this.region = region
    }


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
                KeyConditionExpression: 'pk = :pk',
                ExpressionAttributeValues: { ':pk': pk },
                ProjectionExpression: 'ts, usr, txt',
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

}

module.exports = DynamoApi