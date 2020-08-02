
<script>

    import { onMount } from 'svelte';

    export let friends = []
    export let chatUrl = ''

</script>


<div class="container">

    <p class='intro'>
        Share the link
    </p>

    <div class='link'>
        { chatUrl }
    </div>

    <p class='label'>Friends</p>

    <ul>
        { #each friends as friend }
            <li>
                {friend}
            </li>
        { /each }
    </ul>
    
</div>

<style>

    .container {
        --grey: rgb(220,220,220);
        overflow-y: auto;
        height: 100%;
    }

    .intro {
        font-size: 0.8rem;
        padding-left: 1em;
    }

    .link {
        border-top: 1px solid var(--grey);
        border-bottom: 1px solid var(--grey);
        padding: 1em;
        margin-bottom: 2em;
    }

    .label {
        font-size: 0.8rem;
        padding-left: 1em;
    }

    ul {
        padding: 1em 0;
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