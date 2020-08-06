
<script>

    import { onMount, createEventDispatcher, tick } from "svelte";
    import Icon from 'fa-svelte'

    import { faBell } from '@fortawesome/free-solid-svg-icons/faBell'
    import { faBellSlash } from '@fortawesome/free-solid-svg-icons/faBellSlash'
    import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends'
    import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt'

    import InputBox from './InputBox.svelte'
    import ExternalLink from './ExternalLink.svelte'
    import FriendList from './FriendList.svelte'
    import Sidebar from './Sidebar.svelte'
    import MainMenu from './MainMenu.svelte'
    import ChatMenu from './ChatMenu.svelte'

    import Store from './store.js'

    export let chat = 'chatbox'
    export let usr = ''
    export let chatUrl = ''

    let messageText = ''
    let lastMessageRef = null
    let isMounted = false
    let notificationsActive = false
    let footerRef = null
    let sectionRef = null
    let bottomRef = null
    let sidebarOpen = false
    let chatmenuOpen = false
    const dispatch = createEventDispatcher()

    const colors = [
        '#ff9f43',
        '#ee5253',
        '#0abde3',
        '#10ac84',
        '#01a3a4',
        '#2e86de',
        '#341f97'
    ]

    $: hashes = $Store[chat]['events'].reduce((acc, msg) => {
        if (!acc.has(msg.usr)) {
            const h = hashCode(msg.usr)
            const i = h % colors.length
            const c = colors[i]
            acc.set(msg.usr, c)
        }
        return acc
    }, new Map())

    $: $Store[chat]['events'] && isMounted && scroll()

    $: eventsTF = $Store[chat]['events'].map(evt => {
        const t = new Date(evt.ts)
        let h = t.getHours() % 12
        h = h === 0 ? 12 : h
        const m = t.getMinutes().toString().padStart(2,'0')
        const pm = Math.floor(t.getHours() / 12)
        const am = pm ? 'pm' : 'am'
        evt['tf'] = h + ':' + m + am
        return evt
    })

    function hashCode (str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    function handleSend (event) {
        event.preventDefault()
        const txt = event.detail.inputText
        dispatch('send', { txt })
        messageText = ''
    }

    function toggleNotifications () {
        console.log('toggle')
        notificationsActive = !notificationsActive
    }

    async function scroll () {
        if (bottomRef) {
            await tick()
            bottomRef.scrollIntoView()
        }
    }

    onMount(() => {

        if (lastMessageRef) lastMessageRef.scrollIntoView()

        isMounted = true

        if ('ResizeObserver' in window) {

            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const footerHeight = entry.contentRect.height
                    sectionRef.style['bottom'] = (footerHeight).toString() + 'px'
                }
            })

            resizeObserver.observe(footerRef)

        }
        else {
            alert('Your browser is old and does not support ResizeObserver. You should let Ryan know and then update your browser')
        }

    })


    function openSidebar () {
        console.log('click')
        sidebarOpen = true
    }

</script>

<div class='chatroom'>

    <header>

        <button class='logo-button' on:click={openSidebar}>
            <img class='logo' src='/chicken.svg' alt='logo'/>
        </button>

        <h1>#{chat}</h1>

        <div class='control-panel'>

            <button on:click={() => chatmenuOpen = true}>
                <Icon icon={faUserFriends} />
            </button>

        </div>

    </header>

    <main bind:this={sectionRef}>

        { #each eventsTF as event, i }

            { #if event.evt === 'join' || event.evt === 'add' }

                <p class='event-join'>{event.usr} just joined the chat!</p>

            { :else }

                <div
                    class='bubble'
                    class:mine={event.usr === usr}
                    style={`border-color: ${hashes.get(event.usr)}`}
                >

                    <div class="bubble-header">
                        <span class='name' style={`color: ${hashes.get(event.usr)}`}>
                            { event.usr }
                        </span>

                        <span class='time'>{ event.tf }</span>
                    </div>

                    <p class='text'>{ event.txt }</p>

                </div>

            { /if }

        { /each }

        <div bind:this={bottomRef}/>

    </main>

    <footer bind:this={footerRef}>
        <InputBox on:submit={handleSend}/>
    </footer>

    <Sidebar 
        open={sidebarOpen} 
        side='left'
        on:close={() => sidebarOpen = false}
    >
        <MainMenu/>
    </Sidebar>

    <Sidebar
        open={chatmenuOpen}
        side='right'
        on:close={() => chatmenuOpen = false}
    >
        <ChatMenu {chatUrl} { chat }/>
    </Sidebar>

</div>

<style>

    .chatroom {
        height: 100%;
        width: 100%;
        margin: 0 auto;
        --header-height: 40px;
        --footer-height: 60px;
        font-size: 16px;
        font-family: 'Montserrat', sans-serif;
        --bg-color: #fcfcfc;
        --text-color-dark: #202d34;
        --text-color-light: #485963;
        --pad: 0.5em;
        background-color: var(--bg-color);
    }

    .logo-button {
        padding: 0;
        margin: 0;
    }


    .logo-button:hover {
        cursor: pointer;
    }

    header {
        height: var(--header-height);
        /* box-shadow: 0 5px 10px 5px rgba(0,0,0,0.05); */
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        color: var(--text-color-dark);
        border-bottom: 1px solid #ccc;
        background-color: var(--bg-color);
        z-index: 10;
    }

    .logo {
        height: var(--header-height);
        padding: var(--pad);
    }

    .control-panel {
        display: flex;
        justify-content: flex-end;
        padding-right: 0;
        align-items: center;
        height: 100%;
    }

    button {
        display: block;
        outline: none;
        border: none;
        background-color: transparent;
        margin: 0;
        padding: 0.75em;
        height: var(--header-height);
        width: var(--header-height);
    }

    button :global(svg) {
        color: var(--text-color-dark);
    }

    h1 {
         font-size: inherit;
        font-weight: bold;
        margin: 0;
        padding: 0;
    }

    main {
        position: absolute;
        width: 100%;
        overflow-y: auto;
        max-height: calc(100% - var(--header-height) - var(--footer-height));
        border: 0px solid red;
        bottom: var(--footer-height);
        padding: 0 var(--pad);
        background-color: var(--bg-color);
    }

    .event-join {
        font-style: italic;
        margin: 1em 0;
        color: var(--text-color-light);
    }

    .bubble {
        width: max-content;
        max-width: 80%;
        margin-bottom: var(--pad);
        padding: var(--pad);
        border-radius: 0;
        color: var(--text-color-dark);
    }

    .bubble:not(.mine) {
        border-left: 2px solid black;
    }

    .mine {
        border-right: 2px solid black;
        margin-left: auto;
    }

    .name, .time {
        font-size: 0.75rem;
        font-style: italic;
        color: var(--text-color-light);
    }

    .time {
        margin-left: var(--pad);
    }

    .bubble-header {
        display: flex;
    }

    .mine > .bubble-header {
        justify-content: flex-end;
    }

    .text {
        margin-top: var(--pad);
    }

    .mine > .text {
        text-align: right;
    }

    footer {
        min-height: var(--footer-height);
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: var(--bg-color);
    }

</style>