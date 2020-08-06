
import produce from 'immer'
import { writable } from 'svelte/store'

const chats = {}

const { update, subscribe } = writable(chats)

const onMessage = function (event) {

    update(store => produce(store, draft => {

        const data = JSON.parse(event.data)
        const { chat, usr, ts, txt, evt } = data
        draft[chat]['events'].push({ chat, usr, ts, txt, evt })

    }))

}

const onJoin = function (event) {

    update(store => produce(store, draft => {

        const data = JSON.parse(event.data)
        const { chat, usr, ts, evt } = data
        draft[chat]['events'].push({ chat, usr, ts, evt })
        draft[chat]['friends'].push(usr)

    }))

}

const addChat = function (chat) {

    console.log('addchat: ', chat);

    update(store => produce(store, draft => {

        const events = []
        const friends = []

        const source = new EventSource(`/api/${chat}/events`)

        source.addEventListener('message', onMessage)
        source.addEventListener('join', onJoin)

        draft[chat] = { events, friends, source }

    }))

}

export default { addChat, subscribe }