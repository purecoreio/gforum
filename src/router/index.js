import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/player/:uuid/:page',
    name: 'player',
    props: true,
    component: () => import('../views/Player.vue')
  },
  {
    path: '/network/:uuid/:page/:action?/:actionid?/',
    name: 'network',
    props: true,
    component: () => import('../views/Network.vue')
  },
  {
    path: '/checkout/:uuid/:basket',
    name: 'checkout',
    props: true,
    component: () => import('../views/Checkout.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
