import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiEnvelope, HttpClient } from '@/interface'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.set('token', token)
    }

    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiEnvelope<unknown>
    const code = String(payload.code)
    const message = payload.msg || payload.message || '请求失败'

    if (code === '200') {
      return payload.data as typeof response
    }

    if (code === '-1') {
      ElMessage.error(message || '登录过期，请重新登录')
      if (!response.config.url?.includes('/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/auth/login'
      }
    } else {
      ElMessage.error(message)
    }

    return Promise.reject(new Error(message))
  },
  (error: unknown) => {
    return Promise.reject(error)
  },
)

export default service as HttpClient
