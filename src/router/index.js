import Vue from 'vue'
import VueRouter from 'vue-router'

import HomePage from '../components/Home.vue'
import Magias from '../components/MagiasCrud.vue'
import Monstros from '../components/Monstros.vue'
import MItems from '../components/MItems.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/magias',
    name: 'Magias',
    component: Magias
  },
  {
    path: '/monstros',
    name: 'Monstros',
    component: Monstros
  },
  {
    path: '/magicitems',
    name: 'Magic Items',
    component: MItems
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
