export default class ApiClient {
    constructor (store, router) {
        this.baseUrl = 'http://localhost:3000'
        this.store = store
        this.router = router
    }
    async request (url, payload = null) {
        const options = {
            method: payload ? 'POST' : 'GET',
            headers: {}
        }
        if (payload instanceof FormData) {
            options.body = payload
        } else {
            options.body = JSON.stringify(payload)
            options.headers['Content-Type'] = 'application/json'
        }
        const request = await fetch(`${this.baseUrl}${url}`, options)
        if (request.status === 401) {
            return this.router.push({ name: 'Log In'})
        }
        return request.json()
    }
    get (url) {
        return this.request(url, null)
    }

    post (url, data) {
        console.log(data)
        return this.request(url, data)
    }

    getProjects () {
        return this.get('/projects')
    }

    register (data) {
        return this.post('/user/register', data)
    }

    login (data) {
        return this.post('/user/login', data)
    }
}