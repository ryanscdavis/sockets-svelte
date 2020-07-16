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

    <p>Hi, welcome to the chat!!</p>
    <p>What should we call you?</p>
    <form on:submit={handleSubmit}>
        <input bind:value={name}/>
        <button>Submit</button>
    </form>
</div>

<style>

</style>
