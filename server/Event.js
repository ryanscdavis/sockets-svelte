
const Joi = require('@hapi/joi')

const create = {
    chat: Joi.string(),
    evt: Joi.string().valid('create'),
    ts: Joi.date().iso(),
    usr: Joi.string()
}

const connect = {
    chat: Joi.string(),
    evt: Joi.string().valid('connect'),
    ts: Joi.date().iso(),
    usrId: Joi.string(),
    con: Joi.number().valid(1, -1)
}

const join = {
    chat: Joi.string(),
    evt: Joi.string().valid('join'),
    ts: Joi.date().iso(),
    usr: Joi.string(),
}

const subscribe = {
    chat: Joi.string(),
    evt: Joi.string().valid('subscribe'),
    ts: Joi.date().iso(),
    usr: Joi.string(),
    endpoint: Joi.string(),
    keys: Joi.object().keys({
        p256dh: Joi.string(),
        auth: Joi.string()
    }),
}

const message = {
    pk: Joi.string(),
    sk: Joi.string(),
    chat: Joi.string(),
    evt: Joi.string().valid('message'),
    ts: Joi.date().iso(),
    usr: Joi.string(),
    txt: Joi.string()
}

const schema = new Map()
schema.set('crt', Joi.object(create).options({ presence: 'required', allowUnknown: false }))
schema.set('join', Joi.object(join).options({ presence: 'required', allowUnknown: false }))
schema.set('subscribe', Joi.object(subscribe).options({ presence: 'required', allowUnknown: false }))
schema.set('message', Joi.object(message).options({ presence: 'required', allowUnknown: false }))

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