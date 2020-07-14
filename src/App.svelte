<script>

    import { onMount } from 'svelte'
    import WebSocket from 'isomorphic-ws'

    import Name from './Name.svelte'
    import Chatroom from './Chatroom.svelte'

    let usr = null
    let messages = []
    let ws = null

    $: hash = window.location.hash
    $: chat = hash.substr(1)


    onMount(() => {

        const host = window.location.host
        console.log('mounted, connecting to host', host)

        // const ws = new WebSocket('ws://localhost:8000')
        ws = new WebSocket(`ws://${host}`)

        ws.onopen = function onOpen () {
            const data = { event: 'join', chat: chat }
            ws.send(JSON.stringify(data))
        }

        ws.onmessage = function onMessage(messageEvent) {
            const data = JSON.parse(messageEvent.data)
            console.log('just received data from server')
            console.log(data)
            const event = data['event']
            if (event === 'messages') {
                console.log({ event })
                messages = data['messages']
                messages = messages.reverse()
            }

            if (event === 'message') {
                messages = [ ...messages, data['message'] ]
            }
        }

    })

    const sendMessage = (event) => {
        console.log('received send event')
        const txt = event.detail.txt
        const message = { chat, usr, txt }
        const data = { event: 'message', message }
        if (ws) ws.send(JSON.stringify(data))
        else console.log('ws not available')
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

