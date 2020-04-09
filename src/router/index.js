import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
// import SessionView from '../views/SessionView.vue'
import EmptyRouterView from '@/views/EmptyRouterView.vue'

import SessionList from '@/components/Session/List.vue'
import SessionShow from '@/components/Session/Show.vue'
import TrackShow from '@/components/Track/Show.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'JAM'
    }
  },
  {
    path: '/sessions',
    component: EmptyRouterView,
    children: [
      {
        path: '',
        name: 'SessionList',
        component: SessionList,
        meta: {
          title: 'session list'
        }
      },
      {
        path: ':sessionIndex',
        name: 'SessionShow',
        component: SessionShow,
        meta: {
          title: 'session traklist'
        }
      },
      {
        path: ':sessionIndex/:trackIndex',
        name: 'TrackShow',
        component: TrackShow,
        meta: {
          title: 'track show'
        }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
