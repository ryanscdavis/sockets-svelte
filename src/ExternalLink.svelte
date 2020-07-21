
<script>

    import { createEventDispatcher } from 'svelte'

    export let chatUrl = ''

    let linkRef = null
    const dispatch = createEventDispatcher()

    function handleCopy () {
        navigator.clipboard.writeText(chatUrl).then(() => {
            dispatch('copy')
        })
    }

</script>

<div class='content'>

    <p class='intro'>
        Invite friends to the chat by simply giving them the link!
    </p>

    <p class='link' bind:this={linkRef}>
        { chatUrl }
    </p>

    <button on:click={handleCopy}>Copy</button>

</div>

<style>

    .intro {
        text-align: center;
        padding: 0 1em;
    }

    .link {
        padding: 1em;
        background-color: rgb(220,220,220);
        border-radius: 0.25em;
        width: 100%;
    }

    p + p {
        margin-top: 1em;
    }

    button {
        margin: 0;
        padding: 1em;
        outline: none;
        border: 0;
        color: blue;
        background: transparent;
        margin-left: auto;
        display: block;
    }
</style>