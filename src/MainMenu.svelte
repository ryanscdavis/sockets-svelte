
<script>

    import { onMount } from 'svelte'
    import Storage from './Storage.js'

    let chats = []

    onMount(() => {
        const storage = new Storage()
        if (storage.has('chats')) {
            const obj = storage.getObject('chats')
            chats = Object.keys(obj)
        }
    })

</script>

<ul>
    { #each chats as chat }
        <li>
            #{chat}
        </li>
    { /each }
</ul>


<style>

    ul {
        --grey: rgb(220,220,220);
        padding: 0;
        margin: 0 0;
        list-style: none;
    }

    li {
        padding: 1em;
        margin: 0;
        border-bottom: 1px solid var(--grey);
    }

    li:first-child {
        border-top: 1px solid var(--grey);
    }

</style>