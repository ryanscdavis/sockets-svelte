<script>
    import { createEventDispatcher } from "svelte";

    let inputText = "";
    const dispatch = createEventDispatcher();

    function handleSubmit(e) {
        e.preventDefault();
        dispatch("submit", { inputText });
        inputText = "";
    }
</script>

<footer>
    <form on:submit={handleSubmit}>
        <input type="text" bind:value={inputText} />
        <button disabled={inputText.length === 0}>&#8593;</button>
    </form>
</footer>

<style>
    footer {
        --input-height: 3em;
        --radius: calc(var(--input-height) * 0.5);
        border: 0px solid red;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 80px;
        padding-top: 10px;
    }

    form {
        height: 100%;
        width: 90%;
        position: relative;
        margin: 0 auto;
    }

    input {
        margin: 0;
        padding: 0 3em 0 1.5em;
        height: 3em;
        border-radius: 1.5em;
        width: 100%;
        outline: none;
        border: 0;
        background-color: rgb(230, 230, 230);
    }

    button {
        padding: 0;
        margin: 0;
        height: 2.5em;
        width: 2.5em;
        border-radius: 1.5em;
        position: absolute;
        right: 0.25em;
        top: calc(0.25em);
        border: 0;
        background-color: rgb(61, 130, 236);
        color: white;
    }

    button:hover {
        cursor: pointer;
    }

    button:disabled {
        background-color: grey;
        color: grey;
    }
</style>
