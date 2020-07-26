<script>
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import Icon from "fa-svelte";
    import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons/faArrowCircleUp";

    let inputRef = null;
    const dispatch = createEventDispatcher();

    function handleSubmit() {
        const inputText = inputRef.innerText;
        inputRef.innerText = "";
        if (inputText.length) {
            dispatch("submit", { inputText });
        }
    }
</script>

<style>
    .container {
        border: 0px solid green;
        width: 90%;
        margin: 0.5em auto;
        position: relative;
        font-size: 16px;
    }

    .input {
        padding: 0.25em 1.75em 0.25em 0.875em;
        border-radius: 1em;
        line-height: 1.5;
        background-color: rgb(230, 230, 230);
        outline: none;
    }

    button {
        margin: 0;
        padding: 0;
        height: 1.5em;
        width: 1.5em;
        border-radius: 0.875em;
        position: absolute;
        right: 0.25em;
        bottom: 0.25em;
        border: 0;
        color: rgb(61, 130, 236);
    }

    button:hover {
        cursor: pointer;
    }

    button:disabled {
        background-color: grey;
        color: grey;
    }
</style>

<div class="container">
    <div contenteditable="true" class="input" bind:this={inputRef} />
    <button on:click={handleSubmit}>
        <Icon icon={faArrowCircleUp} />
    </button>
</div>
