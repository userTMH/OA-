import { setToken, getToken, removeToken } from '@/utils/auth'
import { loginApi, getprogileApi } from '@/api/user'
const state = {
  token: getToken(),
  user: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUser(state, user) {
    state.user = user
    console.log(state.user)
  }
}

const actions = {
  //登录
  async login(context, payload) {
    delete payload.isAgree
    const token = await loginApi(payload)
    context.commit('setToken', token)
  },
  //获取用户信息
  async userInfo({ commit }) {
    const res = await getprogileApi()
    // console.log(res)
    commit('setUser', res)
    return res
  },
  //退出登录
  logout(context) {
    context.commit('removeToken')
    context.commit('setUser', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
