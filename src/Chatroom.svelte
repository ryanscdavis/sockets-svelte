
<script>

    import { onMount, createEventDispatcher } from "svelte";

    export let usr = ''
    export let messages = []

    let formRef = null
    let chatboxRef = null
    let messageText = ''
    let dispatch = createEventDispatcher()
    let lastMessageRef = null

    $: lastMessageRef && lastMessageRef.scrollIntoView({ behavior: 'smooth' })

    // convenience func to convert in to pixel string
    const px = v => v.toString() + 'px'

    // update function for visual viewport
    const visualViewportUpdate = () => {
        const {height, offsetTop } = window.visualViewport
        const rect = chatboxRef.getBoundingClientRect()
        chatboxRef.style['max-height'] = px(height - 60)
        chatboxRef.style.top = px(offsetTop + height - 60 - rect.height)
        formRef.style.top = px(offsetTop + height - 60)
    }

    // listener for visual viewport
    // dont want to scroll the last message in the scroll listener
    function handleResize () {
        visualViewportUpdate()
        if (lastMessageRef) lastMessageRef.scrollIntoView()
    }

    // prevent scrolling when chatbox is not full size
    function handleTouchMove (e) {

        const {height, offsetTop } = window.visualViewport

        if (chatboxRef.getBoundingClientRect().height < height - 60) {
            e.preventDefault()
        }
        else {
            e.stopPropagation()
        }

    }

    // bind to the form
    function handleSubmit (event) {
        event.preventDefault()
        dispatch('send', { txt: messageText })
        messageText = ''
    }

    onMount(() => {

        // prevent scrolling on everything except chatbox
        document.getElementById('body').addEventListener('touchmove', e => e.preventDefault(),  { passive: false })
        chatboxRef.addEventListener('touchmove', handleTouchMove, { passive: false })

        // attach listener to visual viewport
        window.visualViewport.addEventListener('resize', handleResize)
        window.visualViewport.addEventListener('scroll', visualViewportUpdate)

        // initial sizing
        handleResize()

    })

</script>

<div class='chatbox' id='chatbox' bind:this={chatboxRef}>
    { #each messages as msg, i }
        { #if i === messages.length - 1 }
            <p bind:this={lastMessageRef} class={ msg.usr === usr ? 'mine' : ''}>{ msg.txt }</p>
        { :else }
            <p class={ msg.usr === usr ? 'mine' : ''}>{ msg.txt }</p>
        { /if }
    { /each }
</div>

<form bind:this={formRef} on:submit={handleSubmit}>
    <input bind:value={messageText}/>
</form>

<style>

    .chatbox {
        border: 0px solid red;
        position: fixed;
        overflow: scroll;
        width: 100%;
        padding: 10px;
    }

    .mine {
        margin-left: auto;
        background-color: rgb(200,200,210);
    }

    p {
        margin: 0;
        padding: 10px;
        background-color: rgb(235,235,235);
        border-radius: 5px;
        max-width: 80%;
        width: max-content;
    }

    p + p {
        margin-top: 10px;
    }

    form {
        position: fixed;
        height: 60px;
        border-top: 1px solid rgb(200,200,200);
        width: 100%;
        padding: 0;
        margin: 0;
    }

    input {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        font-family: inherit;
        font-size: inherit;
    }

</style>