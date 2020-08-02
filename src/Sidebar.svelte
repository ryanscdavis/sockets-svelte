<script>
  import { createEventDispatcher } from "svelte";

  export let open = false
  export let side = 'left'

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
    transition: 0.2s;
  }

  .left {
    left: -100%;
  }

  .right {
    left: 100%;
  }

  .open {
    left: 0;
  }

  .sidebar {
    width: 70%;
    height: 100%;
    border-left: 1px solid rgb(200, 200, 200);
    border-right: 1px solid rgb(200, 200, 200);
    background-color: white;
    padding-top: 1em;
  }

  .sidebar-right {
      margin-left: auto;
  }
</style>

<aside
  class:open
  class:left={side === 'left'}
  class:right={side === 'right'}
  bind:this={bgRef}
  on:click={handleOuterClick}>
  <div class="sidebar" class:sidebar-right={side === 'right'}>
    <slot />
  </div>
</aside>
