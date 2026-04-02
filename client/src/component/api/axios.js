import axios from 'axios'
import { useLoadingStore } from '../../store/useLoadingStore.js'
import { useAuthStore } from '../../store/useAuthStore.js'

const api = axios.create({
    baseURL: '/api',
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const skipLoading = config.headers['x-skip-loading'] === 'true'

        if (!skipLoading) {
            useLoadingStore.getState().startLoading()
        }
        return config
    },
    (error) => {
        useLoadingStore.getState().stopLoading()

        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        const skipLoading = response.config?.headers['x-skip-loading'] === 'true'


        if (!skipLoading) {
            useLoadingStore.getState().stopLoading()
        }

        return response
    },
    (error) => {
        const skipLoading = error.config?.headers['x-skip-loading'] === 'true'

        if (!skipLoading) {
            useLoadingStore.getState().stopLoading()
        }

        const isSigninPage = window.location.pathname === '/signin'

        if (error.response?.status === 401 && !isSigninPage) {
            useAuthStore.getState().logout()
            window.location.href = '/signin?error=auth_expired'

        }

        return Promise.reject(error)
    }
)


// 내일 옆에 종이보고 가만히 있어도/버튼 눌러도 세션 만료 시 튕기게 만드는것 연습
// 1. useAuthStore에 checkAuth만들기 ()
// 2. server에 checkAuth의 요청을 받을 라우트 만들기
// 3. axios.interceptors에서 401은 튕기도록 만들기
// 4. dashboard 상위에서 interval로 요청 보내기(checkAuth)


export default api