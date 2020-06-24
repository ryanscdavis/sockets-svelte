
<script>

    import Header from './Header.svelte'
    import Chatbox from './Chatbox.svelte'
    import Input from './Input.svelte'

    export let hash = ''
    export let usr = ''
    export let messages = []

</script>


<main>
    <Header { hash }/>
    <Chatbox { usr } { messages }/>
    <Input on:send/>
</main>


<style>
</style>