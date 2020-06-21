<script>

    export let usr
    export let socket
    export let messages

    let txt = ''

    const handleSend = function (event) {
        event.preventDefault()
        const msg = { usr, txt }
        socket.emit('msg', msg)
        txt = ''
    }

    socket.on('join', obj => {
        console.log(obj)
        const msg = { usr: 'app', txt: `${obj.usr} just joined the chat!` }
        messages = [ ...messages, msg ]
    })

    socket.on('msg', msg => {
        messages = [ ...messages, msg ]
    })

</script>

<div class='container'>

    <div class='messages'>
        { #each messages as obj }
            <p class={ obj.usr === usr ? 'mine' : '' }>
                { #if obj.usr !== usr && obj.usr !== 'app' }
                    <span class='name'>{ obj.usr }:</span><br/>
                { /if }
                <span class='message'>{ obj.txt }</span>
            </p>
        { /each }
    </div>

    <form on:submit={handleSend}>
        <input type="text" bind:value={ txt }>
        <button>Send</button>
    </form>

</div>

<style>

    .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding: 20px;
    }

    .messages {
        flex-grow: 1;
        font-size: 20px;
        overflow-y: auto;
        height: 50vh;
        display: flex;
        flex-direction: column;
    }

    .mine {
        align-self: flex-end;
        text-align: right;
    }

    p {
        align-self: flex-start;
        display: inline-block;
        margin: 0;
        background-color: rgb(240, 240, 255);
        padding: 5px 20px;
        border-radius: 10px;
    }

    p + p {
        margin-top: 20px;
    }

    .name {
        font-size: 16px;
        color: rgb(150,150,150);
    }

    .message {
        font-size: 20px;
        color: rgb(50,50,50);
    }

    form {
        display: flex;
        justify-content: center;
        padding: 0;
    }

    input {
        margin: 0;
        width: 100%;
        margin-right: 1%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid black;
    }

    button {
        padding: 10px;
        margin: 0;
        border-radius: 5px;
        outline: none;
        border: 1px solid black;
    }

    button:hover {
        cursor: pointer;
    }

</style>