<script>

    import { onMount, onDestroy } from 'svelte'
    import ClientSocket from './ClientSocket.js'
    import Storage from './Storage.js'

    import Name from './Name.svelte'
    import Chatroom from './Chatroom.svelte'

    import toUint8Array from 'urlb64touint8array'
    import uuid from 'uuid/v4'

    import store from './store.js'

    let usr = null
    let usrId = null
    let events = []
    let friends = []
    let clientSocket = null
    let hash

    $: hash = window.location.hash
    $: chat = hash.substr(1)
    $: secure = window.location.protocol === 'https:'
    $: chatUrl = window.location.href

    onMount(() => {

        hash = window.location.hash

        const host = window.location.host

        if (localStorage.getItem('usrId')) {
            usrId = localStorage.getItem('usrId')
        }
        else {
            usrId = uuid()
            localStorage.setItem('usrId', usrId)
        }

        if (localStorage.getItem(chat)) {
            usr = localStorage.getItem(chat)
        }

        store.addChat(chat)

    })

    const sendMessage = async (event) => {

        const evt = 'message'
        const txt = event.detail.txt
        const data = { chat, usr, txt, evt }

        const url = `/api/${chat}/events`
        const method = 'POST'
        const headers = { 'Content-Type': 'application/json' }
        const body = JSON.stringify(data)

        const response = await fetch(url, { method, headers, body })

    }

    async function handleJoin (event) {

        const evt = 'join'

        try {

            const response = await fetch(`/api/${chat}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usr: event.detail.usr, chat, evt })
            })

            console.log('joined chat')

        }
        catch (error) {
            console.error('could not join chat for some reasone')
        }
        
        usr = event.detail.usr
        localStorage.setItem(chat, usr)

        const storage = new Storage()
        const obj = storage.has('chats') ? storage.getObject('chats') : {}
        obj[chat] = usr
        storage.setObject('chats', obj)

    }

</script>

{ #if usr === null }
    <Name on:join={handleJoin}/>
{ :else }
    <Chatroom { usr } { chat } { chatUrl } on:send={sendMessage}/>
{ /if }
