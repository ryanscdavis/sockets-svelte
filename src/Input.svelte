
<script>

    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    let txt = ''

    const handleSubmit = (event) => {
        event.preventDefault()
        dispatch('send', { txt })
        txt = ''
    }

</script>

<form on:submit={handleSubmit}>
    <input bind:value={txt}/>
    <button disabled={txt.length===0}>Send</button>
</form>


<style>

    form {
        display: flex;
        font-family: 'Overpass', sans-serif;
        color: rgb(30,30,30);
        height: 60px;
        padding: 0 10px 20px 10px;
    }

    input {
        border-radius: 5px;
        flex-grow: 1;
        border: 1px solid rgb(200,200,200);
        margin-right: 10px;
        font-size: 16px;
        width: 100%;
        height: 40px;
    }

    button {
        font-size: 16px;
        border-radius: 5px;
        height: 40px;
        width: 60px;
        border: 1px solid rgb(200,200,200);
        background: transparent;
    }

    button:hover {
        cursor: pointer;
    }
</style>