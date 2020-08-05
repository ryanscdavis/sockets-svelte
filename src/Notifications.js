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
