<script>

    import { onMount } from 'svelte'
    import ClientSocket from './ClientSocket.js'

    import Name from './Name.svelte'
    import Chatroom from './Chatroom.svelte'

    let usr = null
    let messages = []
    let clientSocket = null

    $: hash = window.location.hash
    $: chat = hash.substr(1)

    function handleMessages (data) {
        messages = reverse(data)
    }

    onMount(() => {

        const host = window.location.host

        clientSocket = new ClientSocket(host, chat)
        clientSocket.on('messages', data => messages = data.reverse())
        clientSocket.on('message', data => messages = [ ...messages, data ])
        clientSocket.connect()

    })

    const sendMessage = (event) => {

        const txt = event.detail.txt
        const data = { chat, usr, txt }
        clientSocket.send('message', data)

    }

    function handleJoin (event) {
        usr = event.detail.usr
    }


</script>

{ #if usr === null }
    <Name on:join={handleJoin}/>
{ :else }
    <Chatroom { usr } { messages } on:send={sendMessage}/>
{ /if }

<style>
</style>

