
self.addEventListener('push', function (event) {

    let { chat, usr, txt } = event.data.json()

    const title = `New message from ${usr}`
    const options = {
        body: txt
    }

    event.waitUntil(self.registration.showNotification(title, options))

})