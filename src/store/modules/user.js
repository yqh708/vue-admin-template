import {getRequest, postRequest} from '@/utils/request'
import {getToken, setToken, removeToken} from '@/utils/cookie'
import store from '../index'
import router from '../../router'
import {constantRouterMap} from '@/router'

const user = {
  state: {
    userId: '0123456',
    userName: '罗小黑',
    userAlias: '小黑',
    userRole: 1,
    auditState: 0,
    autoLogin: 0,
    token: '123456',
    roles: [],
    user: {
        userId: '0123456',
        userName: '罗小黑',
        userAlias: '小黑',
        userRole: 1,
        roles:0
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_NAME: (state, name) => {
      state.userName = name
    },
    SET_AVATAR: (state, avatar) => {
      state.userAlias = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    LoginByUsername({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        postRequest('/user/login', userInfo)
          .then(response => {
            const data = response.data.data
            const userRole = data.userRole
            commit('SET_USER_ID', data.userId)
            commit('SET_ROLES', [0, 1])
            commit('SET_USER', data)
            setToken(data.token)
            let accessedRouters
            if (userRole === 0) {
              accessedRouters = constantRouterMap
            } else {
              accessedRouters = []
            }
            commit('SET_ROUTERS', accessedRouters)
            router.addRoutes(accessedRouters)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetUserInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getRequest('/user/getUserInfoByToken?token=' + getToken())
          .then(response => {
            const data = response.data.data
            const userRole = response.data.data.userRole
            commit('SET_USER_ID', data.userId)
            commit('SET_ROLES', [0, 1])
            commit('SET_USER', data)
            setToken(data.token)
            let accessedRouters
            console.log(userRole)
            if (userRole === 0) {
              accessedRouters = asyncRouterMap
            } else {
              accessedRouters = []
            }
            commit('SET_ROUTERS', accessedRouters)
            router.addRoutes(accessedRouters)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        router.replace({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
        })
        resolve()
      })
    },
    UpdateUserInfo({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        postRequest('/user/update', userInfo)
          .then(response => {
            const data = response.data.data
            commit('SET_USER', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  }
}

export default user
