
<script>

    import io from 'socket.io-client'

    import Header from './Header.svelte'
    import Chatbox from './Chatbox.svelte'
    import Input from './Input.svelte'

    export let hash = ''
    export let usr = ''
    export let messages = []

    // const sendMessage = (event) => {
    //     console.log('received send event')
    //     const txt = event.detail.txt
    //     const msg = { usr, txt }
    //     messages = [ ...messages, msg ]
    // }

</script>


<main class='screen'>
    <Header { hash }/>
    <div class='flex-grow'>
        <Chatbox { usr } { messages }/>
    </div>
    <Input on:send/>
</main>


<style>
    .screen {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }

    .flex-grow {
        flex-grow: 1;
    }

</style>