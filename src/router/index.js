import Vue from 'vue'
import VueRouter from 'vue-router'
import Dummy from '../views/Dummy.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Dummy,
    children: [
      {
        path: 'authenticated',
        name: 'Authenticated'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
