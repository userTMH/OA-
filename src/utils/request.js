import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

// axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 注入token
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message({ type: 'error', message: message })
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    if (error.response.message == 401) {
      Message({ type: 'warning', message: error.message || 'token超时' })
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message || '请求失败' })
    return Promise.reject(error)
  }
)

export default service
