<script>

    import { onMount } from 'svelte'
    import ClientSocket from './ClientSocket.js'
    import Storage from './Storage.js'

    import Name from './Name.svelte'
    import Chatroom from './Chatroom.svelte'

    import toUint8Array from 'urlb64touint8array'
    import uuid from 'uuid/v4'

    let usr = null
    let usrId = null
    let messages = []
    let friends = []
    let clientSocket = null
    let hash

    $: hash = window.location.hash
    $: chat = hash.substr(1)
    $: secure = window.location.protocol === 'https:'
    $: chatUrl = window.location.href

    onMount(() => {

        hash = window.location.hash

        const host = window.location.host

        if (localStorage.getItem('usrId')) {
            usrId = localStorage.getItem('usrId')
        }
        else {
            usrId = uuid()
            localStorage.setItem('usrId', usrId)
        }

        clientSocket = new ClientSocket(usrId, secure, host, chat)

        clientSocket.on('messages', data => messages = data.reverse())

        clientSocket.on('message', data => {
            console.log({ data })
            messages = [ ...messages, data ]
        })
        clientSocket.on('add', data => messages = [ ...messages, data ])
        clientSocket.on('friends', data => friends = data)
        clientSocket.connect()

        console.log('try to register service worker')
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            startup()
        }
        else {
            console.warn('Browser not compatible with service worker')
        }

        if (localStorage.getItem(chat)) {
            usr = localStorage.getItem(chat)
        }

        window.addEventListener('hashchange', () => console.log(hash))

        fetch(`/api/${chat}/friends`).then(console.log)

    })

    const sendMessage = (event) => {

        const txt = event.detail.txt
        const data = { chat, usr, txt }
        clientSocket.send('message', data)

    }

    function handleJoin (event) {
        usr = event.detail.usr
        localStorage.setItem(chat, usr)
        clientSocket.send('add', { usrId, usr, chat })

        const storage = new Storage()
        const obj = storage.has('chats') ? storage.getObject('chats') : {}
        obj[chat] = usr
        storage.setObject('chats', obj)
    }

    function askPermission () {

        console.log('Ask for notifaction permission')

        const promise = new Promise((resolve, reject) => {
            const permissionResult = Notification.requestPermission(resolve)
            if (permissionResult) permissionResult.then(resolve, reject)
        }).then(permissionResult => {
            if (permissionResult !== 'granted') {
                throw new Error('Permission not granted')
            } else {
                console.log('permission granted')
            }
        })

        return promise

    }

    async function subscribeUserToPush (registration) {

        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: toUint8Array(
                'BItBeVu11iDisfoYJSmu3NnMADSeGo01PkDJKmIyiDLkYoFYl6_LGNm6rU9FDY1BDopX8Pt9Ykh46N8eR_qcbBg'
            )
        }

        // returns a promise that resolves to a PushSubscription
        const pushSubscription = await registration.pushManager.subscribe(subscribeOptions)

        console.log('Recieved push subscription')
        console.log(JSON.stringify(pushSubscription))

        return Promise.resolve(pushSubscription)

    }

    async function registerServiceWorker () {

        const registration = await navigator.serviceWorker.register('service-worker.js')
        console.log('service worker registered')
        return registration

    }

    async function sendSubscription (chat, subscription) {

        const body = JSON.stringify({ chat, subscription })

        return fetch('/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        })

    }

    async function startup () {

        const registration = await registerServiceWorker()
        const permission = await askPermission()
        const subscription = await subscribeUserToPush(registration)
        const response = await sendSubscription(chat, subscription)

    }


</script>

{ #if usr === null }
    <Name on:join={handleJoin}/>
{ :else }
    <Chatroom { usr } events={ messages } { chat } { chatUrl } { friends } on:send={sendMessage}/>
{ /if }

<style>
</style>

