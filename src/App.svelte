<script>
    import io from 'socket.io-client'
    import { onMount } from 'svelte'

    import Name from './Name.svelte'
    import Chatroom from './Chatroom.svelte'

    let usr = null
    let messages = []
    let socket = null

    $: hash = window.location.hash
    $: chat = hash.substr(1)

    onMount(() => {

        console.log({chat})
        socket = io({ query: `chat=${chat}` })

        socket.on('welcome', msgs => {
            console.log('received welcome messages', msgs.length)
            messages = msgs.reverse()
        })

        socket.on('msg', msg => {
            messages = [ ...messages, msg ]
        })

    })

    function handleJoin (event) {
        usr = event.detail.usr
        socket.emit('join', { usr })
    }

    const sendMessage = (event) => {
        console.log('received send event')
        const txt = event.detail.txt
        const msg = { chat, usr, txt }
        socket.emit('msg', msg)
    }

</script>

{ #if !usr }
    <Name on:join={handleJoin}/>
{ :else }
    <Chatroom { usr } { hash } { messages } on:send={sendMessage}/>
{ /if }


<style>
</style>

