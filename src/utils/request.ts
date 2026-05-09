import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

//创建axios实例
const service = axios.create({
    baseURL: '/api',
    timeout: 5000,
})

//请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['token'] = token
        }
        return config
    },
    (error) => {
        // 对请求错误做些什么
        console.log(error)
        return Promise.reject(error)
    }
)

//响应拦截器
service.interceptors.response.use(
    (response) => {
        const { data, config } = response

        // 业务成功
        if (data.code === '200') {
            return data.data
        } else {
            if (data.code === '-1') {
                if (!config.url?.includes('/login')) {
                    ElMessage.error(data.msg || '登录过期，请重新登录')

                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    window.location.href = '/auth/login'
                } else {
                    ElMessage.error(data.msg || '登录过期，请重新登录')
                    return Promise.reject('网络请求失败...')
                }
            }
        }
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default service