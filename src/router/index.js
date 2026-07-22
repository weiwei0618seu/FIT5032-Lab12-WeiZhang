import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseAccountView from '../views/FirebaseAccountView.vue'
import { isAuthenticated } from '../services/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView,
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView,
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView,
  },
  {
    path: '/FirebaseAccount',
    name: 'FirebaseAccount',
    component: FirebaseAccountView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'Login' && isAuthenticated.value) {
    return { name: 'About' }
  }

  return true
})

export default router
