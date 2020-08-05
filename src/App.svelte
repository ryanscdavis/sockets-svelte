<script>

    import { onMount } from 'svelte'
    import ClientSocket from './ClientSocket.js'
    import Storage from './Storage.js'

    import Name from './Name.svelte'
    import Chatroom from './Chatroom.svelte'

    import toUint8Array from 'urlb64touint8array'
    import uuid from 'uuid/v4'

    let usr = null
    let usrId = null
    let messages = []
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

        // TODO: switch chatrooms on hashchange
        // window.addEventListener('hashchange', () => console.log(hash))


        // TODO: ask for notification permission

        const eventSource = new EventSource(`/api/events/${chat}`)

        eventSource.onopen = (event) => {
            console.log('open');
        }

        eventSource.onmessage = (event) => {

            console.log('unnamed message', event.lastEventId);

            const data = JSON.parse(event.data)
            const { chat, usr, ts, txt, evt } = data
            messages = [ ...messages, { chat, usr, ts, txt, evt }]

        }


    })

    const sendMessage = (event) => {

        // const txt = event.detail.txt
        // const data = { chat, usr, txt }
        // clientSocket.send('message', data)

    }

    function handleJoin (event) {
        usr = event.detail.usr
        localStorage.setItem(chat, usr)
        // clientSocket.send('add', { usrId, usr, chat })

        const storage = new Storage()
        const obj = storage.has('chats') ? storage.getObject('chats') : {}
        obj[chat] = usr
        storage.setObject('chats', obj)
    }

</script>

{ #if usr === null }
    <Name on:join={handleJoin}/>
{ :else }
    <Chatroom { usr } events={ messages } { chat } { chatUrl } { friends } on:send={sendMessage}/>
{ /if }
