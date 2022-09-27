import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/tour/adminIndex',
    name: 'adminIndexApp',
    component: () => import('../views/adminIndexApp.vue'),
    children: [
      {
        path: '/tour/ticket',
        name: 'TicketApp',
        component: () => import('../views/TicketApp.vue')
      },
      {
        path: '/tour/orders',
        name: 'OrdersApp',
        component: () => import('../views/OrdersApp.vue')
      },
      {
        path: '/tour/scenic',
        name: 'ScenicApp',
        component: () => import('../views/ScenicApp.vue')
      },
      {
        path: '/tour/food',
        name: 'FoodApp',
        component: () => import('../views/FoodApp.vue')
      },
      {
        path: '/tour/notice',
        name: 'NoticeApp',
        component: () => import('../views/NoticeApp.vue')
      },
      {
        path: '/tour/tourist',
        name: 'TouristApp',
        component: () => import('../views/TouristApp.vue')
      },
      {
        path: '/tour/admin',
        name: 'AdminApp',
        component: () => import('../views/AdminApp.vue')
      },
      {
        path: '/tour/adminIndex',
        redirect: '/tour/scenic'
      }
    ]
  },
  // 用户界面
  {
    path: '/index',
    name: 'IndexApp',
    component: () => import('../views/IndexApp.vue')
  },
  {
    path: '/user/userlogin',
    name: 'UserLogin',
    component: () => import('../views/user/UserLogin.vue')
  },
  {
    path: '/user/userregister',
    name: 'UserRegister',
    component: () => import('../views/user/UserRegister.vue')
  },
  {
    path: '/user/food',
    name: 'SystemFood',
    component: () => import('../views/user/SystemFood.vue')
  },
  {
    path: '/user/scenic',
    name: 'SystemScenic',
    component: () => import('../views/user/SystemScenic.vue')
  },
  {
    path: '/user/userorder',
    name: 'UserOrder',
    meta: {
      requiredAuth: true
    },
    component: () => import('../views/user/UserOrder.vue')
  },
  {
    path: '/user/userbuytickets',
    name: 'UserBuyTickets',
    meta: {
      requiredAuth: true
    },
    component: () => import('../views/user/UserBuyTickets.vue')
  },
  {
    path: '/user/userinfo',
    name: 'UserInfo',
    meta: {
      requiredAuth: true
    },
    component: () => import('../views/user/UserInfo.vue'),
    children: [
      {
        path: '/spaceinfo',
        name: 'SpaceInfo',
        meta: {
          requiredAuth: true
        },
        component: () => import('../views/user/SpaceInfo.vue')
      },
      {
        path: '/changepassword',
        name: 'ChangePassword',
        meta: {
          requiredAuth: true
        },
        component: () => import('../views/user/ChangePassword.vue')
      },
      {
        path: '/user/userinfo',
        redirect: '/spaceinfo'
      }
    ]
  },
  {
    path: '/',
    redirect: '/index' // 重定向
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局导航前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiredAuth) {
    const loginUser = JSON.parse(sessionStorage.getItem(store.state.loginUser))
    if (loginUser && loginUser.token != null) {
      next()
    } else {
      Message({
        message: '请先登录',
        type: 'warning',
        duration: 1500,
        showClose: true,
        center: true
      })
      next({ path: '/user/userlogin' })
    }
  } else {
    next()
  }
})
export default router
