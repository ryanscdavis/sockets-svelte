
const { Transform } = require('stream')

class SSEStream extends Transform {

    constructor () {

        const options = {
            objectMode: true
        }

        super(options)

    }

    ping () {
        this.push(':\n\n')
    }

    _transform (chunk, encoding, callback) {

        let msg = ''

        if ('id' in chunk) msg += `id: ${chunk['id']}\n`
        if ('event' in chunk) msg += `event: ${chunk['event']}\n`
        if ('retry' in chunk) msg += `retry: ${chunk['retry']}\n`

        if ('data' in chunk) {

            const data = chunk['data']

            if (typeof data === 'string') {
                msg += `data: ${data}\n`
            }
            else if (typeof data === 'object') {
                msg += `data: ${JSON.stringify(data)}\n`
            }

        }

        msg += '\n'

        callback(null, msg)

    }

}

module.exports = SSEStream