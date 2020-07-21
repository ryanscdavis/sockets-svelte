<script>
    import { createEventDispatcher } from "svelte";

    export let active = false;

    let backgroundRef = null;
    const dispatch = createEventDispatcher();

    function handleOuterClick(event) {
        if (event.target === backgroundRef) {
            event.preventDefault();
            dispatch("close");
        }
    }
</script>

<style>
    .background {
        position: fixed;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.66);
    }

    .window {
        background-color: white;
        width: 80%;
        border-radius: 1em;
        padding: 1em;
    }

    footer {
        display: flex;
        justify-content: flex-end;
    }

    button {
        margin: 0;
        padding: 0.5em;
        border: none;
        background: transparent;
        font-size: inherit;
        font-family: inherit;
        color: blue;
    }
</style>

{#if active}
    <div
        class="background"
        on:click={handleOuterClick}
        bind:this={backgroundRef}>
        <div class="window">
            <slot />
            <!-- <footer>
                <button on:click={() => dispatch('close')}>OK</button>
            </footer> -->
        </div>
    </div>
{/if}
