import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/Layout'
Vue.use(VueRouter)

export const constantRouterMap = [

  {
    path: '',
    component: Layout,
    redirect: '/home',
    meta: { title: 'warning', icon: 'documentation', noCache: true },
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/index',
    meta: { title: 'home', icon: 'documentation', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: { title: '首页', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/about',
    component: Layout,
    redirect: '/about/index',
    meta: { title: '关于', icon: 'documentation', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/about/index'),
        name: 'logger',
        meta: { title: '关于', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/page1',
    component: Layout,
    redirect: '/page1/menu',
    meta: { title: '页面1', icon: 'documentation', noCache: true },
    children: [
      {
        path: 'menu',
        component: () => import('@/views/page1/menu/menu1'),
        name: 'logger',
        meta: { title: '菜单1', icon: 'documentation', noCache: true }
      }, {
        path: 'menu',
        component: () => import('@/views/page1/menu/menu2'),
        name: 'logger',
        meta: { title: '菜单2', icon: 'documentation', noCache: true }
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:constantRouterMap
})

export default router
