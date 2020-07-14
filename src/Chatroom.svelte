
<script>

    import { onMount, createEventDispatcher } from "svelte";

    export let usr = ''
    export let messages = []

    let messageText = ''
    let lastMessageRef = null
    const dispatch = createEventDispatcher()

    $: messages && lastMessageRef && lastMessageRef.scrollIntoView({ behavior: 'smooth' })

    // bind to the form
    function handleSubmit (event) {
        event.preventDefault()
        dispatch('send', { txt: messageText })
        messageText = ''
    }

    onMount(() => {
        if (lastMessageRef) lastMessageRef.scrollIntoView()
    })

</script>

<main>

    <section>
        { #each messages as msg, i }
            { #if i === messages.length - 1 && msg.usr === usr }
                <p class='mine' bind:this={lastMessageRef}>{ msg.txt }</p>
            { :else if i === messages.length - 1 }
                <span>{ msg.usr }:</span>
                <p bind:this={lastMessageRef}>{ msg.txt }</p>
            { :else if msg.usr === usr }
                <p class='mine'>{ msg.txt }</p>
            { :else }
                <span>{ msg.usr }:</span>
                <p>{ msg.txt }</p>
            { /if }
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
        --footer-height: 80px;
    }

    section {
        position: absolute;
        width: 100%;
        overflow-y: auto;
        max-height: calc(100% - var(--footer-height));
        border: 2px solid red;
        bottom: var(--footer-height);
        padding: 0.5em;
    }

    p {
        width: max-content;
        max-width: 80%;
        margin-bottom: 1em;
        border: 1px solid rgb(220,220,220);
        padding: 0.5em;
        border-radius: 0.5em;
    }

    .mine {
        margin-left: auto;
    }

    footer {
        position: fixed;
        height: var(--footer-height);
        width: 100%;
        border-top: 2px solid white;
        bottom: 0;
        border: 2px solid green;
    }

</style>