export default class ApiClient {
    constructor (store, router) {
        this.baseUrl = 'http://localhost:5000'
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

    async getProjects () {
        const request = await this.request('/projects')
        if (!request?.projects) {
            return request
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

    async createMaterial (data) {
        const response = await this.request('/project/material/create', data)
        if (!response?.material) {
            return response
        }
        return response.material
    }

    async getMaterials(projectId) {
        const url = '/project/materials/'+projectId
        const request = await this.request(url)
        if (!request?.materials) {
            return request
        }
        return request.materials
    }

    async updateMaterial (updateId, data) {
        const response = await this.request('/project/material/update/'+updateId, data)
        if (!response?.updateMaterial) {
            return response
        }
        return response.updateMaterial
    }

    async deleteMaterial(materialId) {
        const url = '/project/material/delete/'+materialId
        const request = await this.request(url)
        if (!request?.material) {
            return request
        }
        return request.material
    }

    async updateLineItem (data) {
        const response = await this.request('/project/material/line-item/update/', data)
        if (!response?.updateLineItem) {
            return response
        }
        return response.updateLineItem
    }

    async duplicateLineItem (id) {
        const response = await this.request('/project/material/line-item/duplicate/'+id)
        if (!response?.duplicateLineItem) {
            return response
        }
        return response.duplicateLineItem
    }

    async deleteLineItem(lineItemId) {
        const url = '/project/material/line-item/delete/'+lineItemId
        const request = await this.request(url)
        if (!request?.deleteLineItem) {
            return request
        }
        return request.deleteLineItem
    }

    async getLineItemsWithMaterials(projectId) {
        const url = '/project/material/line-items/both/'+projectId
        const request = await this.request(url)
        if (!request?.lineItemsWithMaterials) {
            return request
        }
        return request.lineItemsWithMaterials
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
        const response = await this.request('/project/create', data)
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
