<script>

    import { onMount, createEventDispatcher } from 'svelte'

    export let hash = ''
    export let usr = ''
    export let messages = []

    let boxRef = null
    let formRef = null
    let messageText = ''
    let lastMessage = null
    const dispatch = createEventDispatcher()

    $: lastMessage && lastMessage.scrollIntoView({ behavior: 'smooth' })

    const px = v => v.toString() + 'px'

    const update = () => {

        const { width, height, offsetTop, offsetLeft } = window.visualViewport

        formRef.style.width = px(width)
        formRef.style.left = px(offsetLeft)
        formRef.style.top = px(offsetTop + height - 60)
        boxRef.style.width = px(width)
        boxRef.style.height = px(height - 60)
        boxRef.style.left = px(offsetLeft)
        boxRef.style.top = px(offsetTop)

    }

    // firefox doesnt have visualViewport enabled by default
    if (window.visualViewport) {

        onMount(update)

        window.visualViewport.addEventListener('resize', update)
        window.visualViewport.addEventListener('scroll', update)

    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch('send', { txt: messageText })
        messageText = ''
    }

</script>



<div class='container'>

    <div class='chatbox' bind:this={boxRef}>

        { #each messages as msg }
            <p bind:this={lastMessage}>{ msg.txt }</p>
        { /each }

    </div>

    <form bind:this={formRef} on:submit={handleSubmit}>
        <input bind:value={messageText}>
    </form>

</div>

<style>

    .container {
        position: absolute;
        font-size: 14px;
    }

    .chatbox {
        position: fixed;
        border: 0px solid black;
        bottom: 60px;
        width: 100%;
        height: calc(100vh - 60px);
        overflow: auto;
    }

    form {
        position: fixed;
        bottom: 0;
        height: 60px;
        width: 100%;
        padding: 10px;
    }

    input {
        width: 100%;
        border-radius: 5px;
        border: 1px solid rgb(200,200,200);
        outline: none;
        height: 100%;
    }

</style>