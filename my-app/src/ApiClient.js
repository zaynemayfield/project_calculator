export default class ApiClient {
    constructor (store, router) {
        this.baseUrl = 'http://localhost:3000'
        this.store = store
        this.router = router
        this.accessToken = window.localStorage.getItem('accessToken')
    }

    async request (url, payload = null) {
      const method = payload ? 'POST' : 'GET'
      console.log(`Request: ${method} ${url}`)
        const options = {
            method: method,
            headers: {}
        }
        if (payload instanceof FormData) {
            options.body = payload
        } else if(payload) {
            options.body = JSON.stringify(payload)
            options.headers['Content-Type'] = 'application/json'
        }
        if (this.accessToken) {
            options.headers['Authorization'] = `Bearer ${this.accessToken}`
        }
        const request = await fetch(`${this.baseUrl}${url}`, options)
        if (request.status === 401) {
            return this.router.push({ name: 'Login'})
        }
        const response = await request.json()
        if (response.errors) {
            this.store.commit('errors', response.errors)
        }
        return response
    }

    get (url) {
        return this.request(url, null)
    }

    post (url, data) {
        console.log(data)
        return this.request(url, data)
    }

    async getProjects () {
        const request = await this.get('/projects')
        if (!request?.projects) {
            return request;
        }
        return request.projects
    }

    register (data) {
        return this.post('/user/register', data)
    }

    setAccessToken (token) {
        this.accessToken = token
        window.localStorage.setItem('accessToken', token)
    }

    async login (data) {
        const response = await this.post('/user/login', data)
        if (response.accessToken) {
            this.setAccessToken(response.accessToken)
            this.router.push({ name: 'Home' })
        }
        return response
    }
}