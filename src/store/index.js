import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 全局变量的位置，刷新就没了
  state: {
    serverPath: 'http://127.0.0.1:8081',
    fullscreenLoading: false,
    loginUser: 'loginUser', // 当前会话登录用户的key
    user: JSON.parse(sessionStorage.getItem('loginUser')),
    loginAdmin: 'loginAdmin', // 当前会话登录管理员的key
    admin: JSON.parse(sessionStorage.getItem('loginAdmin'))
  },
  getters: {
  },
  mutations: {
    /** 统一修改入口 */
    updateFullscreenLoading (state, value) {
      state.fullscreenLoading = value
    },
    updateUser (state, value) {
      state.user = value
    }
  },
  actions: {
  },
  modules: {
  }
})
