import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './css/global.css'
import './css/index.css'
import './css/userinfo.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$message = Message

axios.defaults.baseURL = 'http://localhost:8081'

// 请求前置拦截器
axios.interceptors.request.use((config) => {
  // 请求前，自动添加token
  const loginUser = JSON.parse(sessionStorage
    .getItem(store.state.loginUser))
  if (loginUser && loginUser.token) {
    config.headers.Authorization = loginUser.token
  }
  return config
})
// 响应拦截器
axios.interceptors.response.use((config) => {
  if (config.data.code === 2002 || config.data.code === 2003 ||
    config.data.code === 2004) {
    Message({
      message: config.data.message,
      type: 'error',
      center: true,
      offset: 20
    })
    // 令牌过期，删除旧令牌
    if (config.data.code === 2004) {
      sessionStorage.removeItem(store.state.loginUser)
      router.push('/index')
    }
  }
  return config
}, (error) => {
  if (store.state.fullscreenLoading) {
    // 调用统一入口修改
    store.commit('updateFullscreenLoading', false)
    Message({
      message: '服务器未响应，请重试!',
      type: 'warning',
      duration: 1500,
      showClose: true,
      center: true
    })
  }
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
