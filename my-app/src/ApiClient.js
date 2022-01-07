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

    //process (type, url, data = null) {
    //    return this.request(type, url, data)
    //}

    //post (url, data) {
    //    console.log(data)
    //    return this.request(url, data)
    //}

    async getProjects () {
        const request = await this.request('/projects')
        if (!request?.projects) {
            return request;
        }
        return request.projects
    }

    async getProject (projectId) {
        const url = '/project/'+projectId
        const request = await this.request(url)
        if (!request?.project) {
            return request;
        }
        return request.project
    }

    async getPublicProjects () {
        const request = await this.request('/projects/public')
        if (!request?.projects) {
            return request;
        }
        return request.projects
    }

    async register (data) {
        const response = await this.request('/user/register', data)
        if (response.user) {
            this.router.push({ name: 'Login'})
        }
        return response
    }

    async newProject (data) {
        const response = await this.request('/projects/create', data)
        if (response.project) {
            this.router.push({ name: 'Design Project', params: {id: response.project.id}})
        }
        return response
    }

    setAccessToken (token) {
        this.accessToken = token
        this.store.commit('accessToken', this.accessToken)
        window.localStorage.setItem('accessToken', token)
    }

    async login (data) {
        const response = await this.request('/user/login', data)
        if (response.accessToken) {
            this.setAccessToken(response.accessToken)
            this.store.commit('isLoggedIn', true)
            this.router.push({ name: 'Home' })
        }
        return response
    }

    logout () {
        this.setAccessToken('');
        this.store.commit('isLoggedIn', false)
        this.router.push({ name: 'Landing' })
    }

    redirect (name, param) {
        if (param) {
            this.router.push({ name: name, params: {id: param}})
        } else {
            this.router.push({ name: name})
        }

    }

}