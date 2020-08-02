<script>

    import { createEventDispatcher } from "svelte";

    export let open = false;

    let bgRef = null;
    let dispatch = createEventDispatcher();

    function handleOuterClick(event) {
        if (event.target === bgRef) {
            event.preventDefault();
            dispatch("close");
        }
    }

</script>

<style>
  aside {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: -100%;
    transition: 0.2s;
  }

  .sidebar {
    width: 80%;
    height: 100%;
    border-right: 1px solid rgb(200, 200, 200);
    background-color: white;
  }

  .open {
    left: 0;
  }
</style>

<aside class:open bind:this={bgRef} on:click={handleOuterClick}>
  <div class="sidebar">
    <slot />
  </div>
</aside>
