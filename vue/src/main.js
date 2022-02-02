import { createApp } from 'vue'
import ApiClient from './ApiClient'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
app.provide('$api', new ApiClient(store, router))
app.use(store).use(router).mount('#app')
