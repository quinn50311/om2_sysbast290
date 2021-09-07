import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/insert',
      name: 'insert',
      component: () => import('./views/Insert.vue')
    },
    {
      path: '/sys/sysbas/sysbast290',
      name: 'Dashboard',
      component: () => import('./components/Dashboard.vue'),
      children: [
        {
          path: 'programGroup',
          name: 'programGroup',
          component: () => import('./views/ProgramGroup.vue')
        },
        {
          path: 'program',
          name: 'program',
          component: () => import('./views/Program.vue')
        }
      ]
    }
  ]
})
