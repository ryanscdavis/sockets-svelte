<script>

    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    let name = ''

    const handleSubmit = function (event) {
        event.preventDefault()
        dispatch('join', { usr: name })
    }

</script>

<div class='container'>

    <p>Hi, welcome to the chat!</p>
    <p>What should we call you?</p>
    <form on:submit={handleSubmit}>
        <input bind:value={name}/>
        <button>Submit</button>
    </form>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    p {
        font-size: 52px;
        margin: 0;
        padding: 0;
    }

    p + p {
        margin-top: 30px;
    }

    form {
        margin-top: 30px;
        min-width: 50%;
        display: flex;
        justify-content: center;
    }

    input {
        font-size: 26px;
        padding: 20px;
        border-radius: 5px;
        outline: none;
        border: 1px solid black;
        min-width: 70%;
        margin-right: 20px;
    }

    button {
        padding: 20px;
        border-radius: 5px;
        border: 1px solid black;
    }
</style>
