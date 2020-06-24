
<script>

    import { onMount } from 'svelte'

    export let messages = []
    export let usr = ''

    let lastMessage = null

    $: lastMessage && lastMessage.scrollIntoView({ behavior: 'smooth' })

    onMount(() => {
        if (lastMessage) lastMessage.scrollIntoView()
    })

    const hashCode = str => {
        let hash = 0, i, chr;
        for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    let colors = [ '#f4f3f3', '#bfd8d5', '#b1bed5', '#8ac6d1' ]

    $: decorated = messages.map((msg, ndx, arr) => {
        const showName = (msg.usr !== usr) && (ndx===0 || arr[ndx-1].usr !== arr[ndx].usr)
        const color = colors[hashCode(msg.usr) % colors.length]
        return Object.assign({ showName, color }, msg)
    })

</script>

<div class='chatbox'>
    { #each decorated as msg }
        { #if msg.showName }
            <span>{ msg.usr }:</span>
        { /if }
        <p
            bind:this={lastMessage}
            class={msg.usr === usr ? 'mine' : ''}
            style='background-color: {msg.color}'
        >
            { msg.txt }
        </p>
    { /each }
</div>

<style>

    .chatbox {
        height: 100%;
        height: calc(100vh - 120px);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;  /* doesnt completely work for firefox, see below */
        box-sizing: border-box;
        line-height: 1.5;
        font-family: 'Overpass', sans-serif;
        color: rgb(30,30,30);
    }

    .chatbox {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }

    .chatbox::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }

    p {
        display: inline-block;
        width: auto;
        padding: 10px;
        background-color: rgb(210,210,210);
        max-width: 70%;
        margin: 0;
        border-radius: 5px;
    }

    /* add spacing between messages */
    p + p {
        margin: 10px 0 0 0;
    }

    span {
        color: rgb(100,100,100);
    }

    .mine {
        align-self: flex-end;
    }

    @supports (-moz-appearance:none) {

        /*
            This is for wierd behavior in firefox where the bottom padding
            does not have an effect for block elements with overflow set.
            We fix this by inserting a spacer, targeted to firefox brower.
            https://stackoverflow.com/a/57560978
        */

        .chatbox::after {
            content: '';
            display: block;
            padding: 5px;
        }

    }

</style>