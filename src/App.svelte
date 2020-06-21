<script>
    import io from 'socket.io-client'

    import Name from './Name.svelte'
    import Chat from './Chat.svelte'

    let usr = null
    let messages = []
    const socket = io()

    socket.on('welcome', msgs => {
        messages = msgs.reverse()
    })

    function handleJoin (event) {
        usr = event.detail.usr
        socket.emit('join', { usr })
    }

</script>

{ #if !usr }
    <Name on:join={handleJoin}/>
{ :else }
    <Chat {usr} {socket} {messages}/>
{ /if }

