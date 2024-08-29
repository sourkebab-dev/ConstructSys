import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('../views/CreatePage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
  ]
})

export default router
