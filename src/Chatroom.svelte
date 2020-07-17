
<script>

    import { onMount, createEventDispatcher } from "svelte";

    export let chat = 'chatbox'
    export let usr = ''
    export let messages = []

    let messageText = ''
    let lastMessageRef = null
    let isMounted = false
    const dispatch = createEventDispatcher()


    const colors = [
        'rgb(61, 130, 236)',
        'rgb(107, 63, 235)',
        'rgb(241, 162, 33)'
    ]

    $: hashes = messages.reduce((acc, msg) => {
        if (!acc.has(msg.usr)) {
            const h = hashCode(msg.usr)
            const i = h % colors.length
            const c = colors[i]
            console.log(msg.usr, h, i, c)
            acc.set(msg.usr, c)
        }
        return acc
    }, new Map())

    $: messages && messages.length && isMounted && scroll()


    function hashCode (str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // bind to the form
    function handleSubmit (event) {
        event.preventDefault()
        dispatch('send', { txt: messageText })
        messageText = ''
    }

    function scroll (node) {
        if (node) node.scrollIntoView()
    }

    onMount(() => {

        if (lastMessageRef) lastMessageRef.scrollIntoView()

        isMounted = true

    })

</script>

<main>

    <header><h1>#{chat}</h1></header>

    <section>
        { #each messages as msg, i }
            <div
                class='bubble'
                class:mine={msg.usr === usr}
                use:scroll
                style={`background-color: ${hashes.get(msg.usr)};`}
            >
                <span class='name'>{ msg.usr }</span>
                <p class='text'>{ msg.txt }</p>
            </div>
        { /each }
    </section>

    <footer>
        <form on:submit={handleSubmit}>
            <input bind:value={messageText}/>
        </form>
    </footer>

</main>


<style>

    main {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        --header-height: 40px;
        --footer-height: 80px;
        font-size: 16px;
        font-family: 'Montserrat', sans-serif;
    }

    header {
        height: var(--header-height);
        box-shadow: 0 5px 10px 5px rgba(0,0,0,0.05);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    h1 {
        font-weight: bold;
        margin: 0;
        padding: 0;
    }

    section {
        position: absolute;
        width: 100%;
        overflow-y: auto;
        max-height: calc(100% - var(--header-height) - var(--footer-height));
        border: 0px solid red;
        bottom: var(--footer-height);
        padding: 1em;
    }

    .bubble {
        width: max-content;
        max-width: 80%;
        margin-bottom: 1em;
        padding: 1em;
        border-radius: 1em;
        color: white;
    }

    .mine {
        margin-left: auto;
    }

    .name {
        font-style: italic;
        color: rgb(220,220,220);
    }

    .text {
        margin-top: 0.5em;
    }

    footer {
        position: fixed;
        height: var(--footer-height);
        width: 100%;
        border-top: 2px solid white;
        bottom: 0;
        border: 0px solid green;
        display: flex;
        justify-content: center;
    }

    form {
        width: 90%;
        margin-top: 10px;
    }

    input {
        width: 100%;
        border: 0;
        outline: 0;
        height: 2.75em;
        background-color: rgb(225,225,225);
        border-radius: 2.75em;
    }

</style>