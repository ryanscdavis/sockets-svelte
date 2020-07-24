
const Joi = require('@hapi/joi')

const crtObj = {
    chat: Joi.string(),
    evt: Joi.string().valid('crt'),
    ts: Joi.date().iso(),
    usr: Joi.string()
}

const addObj = {
    chat: Joi.string(),
    evt: Joi.string().valid('add'),
    ts: Joi.date().iso(),
    usr: Joi.string(),
    add: Joi.number().valid(1,-1)
}

const subObj = {
    chat: Joi.string(),
    evt: Joi.string().valid('sub'),
    ts: Joi.date().iso(),
    usr: Joi.string(),
    endpoint: Joi.string(),
    keys: Joi.object().keys({
        p256dh: Joi.string(),
        auth: Joi.string()
    }),
    subscribe: Joi.number().valid(1,-1)
}

const msgObj = {
    chat: Joi.string(),
    evt: Joi.string().valid('msg'),
    ts: Joi.date().iso(),
    usr: Joi.string(),
    txt: Joi.string()
}

const schema = new Map()
schema.set('crt', Joi.object(crtObj).options({ presence: 'required' }))
schema.set('add', Joi.object(addObj).options({ presence: 'required' }))
schema.set('sub', Joi.object(subObj).options({ presence: 'required' }))
schema.set('msg', Joi.object(msgObj).options({ presence: 'required' }))

class Event {

    constructor (data) {

        // validate data
        if (data.evt && schema.has(data.evt)) {
            const result = schema.get(data.evt).validate(data)
            if (result.error) throw Error(result.error)
        }
        else {
            throw Error('Invalid event type', data.evt)
        }

        this._data = data

    }

    getChat () { return this._data.chat }

    getEventType () { return this._data.evt }

    getTimestamp () { return this._data.ts }

    getUserName () { return this._data.usr }

    getData () { return this._data }

}

module.exports = Event