
<script>

    import { onMount, setContext } from 'svelte'

    let ref = null

    let screenHeight = 0

    const resize = () => {

        const { width, height, offsetTop } = window.visualViewport

        // resize content div
        const w = Math.floor(width).toString() + 'px'
        const h = Math.floor(height).toString() + 'px'
        const t = Math.floor(offsetTop).toString() + 'px'
        ref.style.width = w
        ref.style.height = h
        ref.style.top = t

        // make available to nested components
        setContext('visualViewport', { width, height })

    }

    window.visualViewport.addEventListener('resize', resize)

    onMount(resize)

</script>

<main>
    <div class='content' bind:this={ref}>
        <slot/>
    </div>
</main>

<style>

    main {
        position: relative;
    }

    .fixed {
        position: fixed;
        top: 50px;
    }

    .content {
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .a {
        flex-grow: 1;
    }
</style>