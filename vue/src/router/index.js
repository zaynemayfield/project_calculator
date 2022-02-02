import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/project/new',
    name: 'New Project',
    component: () => import('../views/ProjectNew.vue')
  },
  {
    path: '/project/view/:id',
    name: 'View Project',
    component: () => import('../views/ProjectView.vue')
  },
  {
    path: '/project/design/:id',
    name: 'Design Project',
    component: () => import('../views/ProjectDesign.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
