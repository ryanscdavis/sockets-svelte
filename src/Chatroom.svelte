
<script>
    import { onMount, createEventDispatcher } from "svelte";

    export let messages = []

    let formRef = null
    let chatboxRef = null
    let messageText = ''
    let dispatch = createEventDispatcher()
    let ref = null

    const px = v => v.toString() + 'px'

    const visualViewportUpdate = () => {
        const {height, offsetTop } = window.visualViewport
        chatboxRef.style['max-height'] = px(height - 60)
        chatboxRef.style.top = px(offsetTop)
        formRef.style.top = px(offsetTop + height - 60)
    }

    const handleTouchStart = (e) => {

        const {height, offsetTop } = window.visualViewport

        if (chatboxRef.getBoundingClientRect().height < height - 60 - 300) {
            ref.focus()
            e.preventDefault()
        }

    }

    const handleTouchMove = (e) => {

        const {height, offsetTop } = window.visualViewport

        if (chatboxRef.getBoundingClientRect().height < height - 60) {
            e.preventDefault()
        }
        else {
            e.stopPropagation()
        }

    }

    onMount(() => {

        document.getElementById('body').addEventListener('touchmove', e => e.preventDefault(),  { passive: false })
        chatboxRef.addEventListener('touchmove', handleTouchMove, { passive: false })

        window.visualViewport.addEventListener('resize', visualViewportUpdate)
        window.visualViewport.addEventListener('scroll', visualViewportUpdate)

        visualViewportUpdate()

        formRef.addEventListener('touchstart', handleTouchStart, { passive: false })

    })

    function handleSubmit (event) {
        event.preventDefault()
        dispatch('send', { txt: messageText })
        messageText = ''
    }


</script>

<form class='invisible' on:submit={handleSubmit}>
    <input bind:this={ref} bind:value={messageText}/>
</form>

<div class='chatbox' id='chatbox' bind:this={chatboxRef}>
    { #each messages as msg }
        <p>{ msg.txt }</p>
    { /each }
</div>

<form bind:this={formRef} on:submit={handleSubmit}>
    <input bind:value={messageText}/>
</form>

<style>

    .invisible {
        height: 0;
        width: 0;
    }

    .chatbox {
        border: 0px solid red;
        position: fixed;
        overflow: scroll;
        width: 100%;
    }

    form {
        position: fixed;
        height: 60px;
        border-top: 1px solid rgb(200,200,200);
        width: 100%;
    }

    p {
        margin: 0;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    input {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
    }
</style>