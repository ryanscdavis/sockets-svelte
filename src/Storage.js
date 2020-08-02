

export default class Storage {
    
    constructor () {
        if ('localStorage' in window) {
            this.store = window.localStorage
        }
        else {
            console.error('no access to local storage')
        }
    }

    has (key) {
        const value = this.store.getItem(key)
        return value !== null
    }

    getObject(key) {
        const value = this.store.getItem(key)
        return value ? JSON.parse(value) : value
    }

    setObject(key, obj) {
        this.store.setItem(key, JSON.stringify(obj))
    }

}