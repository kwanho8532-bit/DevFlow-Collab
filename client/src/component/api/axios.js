import axios from 'axios'
import { useLoadingStore } from '../../store/useLoadingStore.js'
import { useAuthStore } from '../../store/useAuthStore.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const skipLoading = config.headers['x-skip-loading'] === 'true'

        if (!skipLoading) {
            useLoadingStore.getState().startLoading()
        }

        const token = useAuthStore.getState().csrfToken;

        // 데이터 변경 가능성이 있는 메서드들
        const protectedMethods = ['post', 'put', 'patch', 'delete'];

        // 현재 요청 메서드가 보호 대상이고 토큰이 있다면 헤더 추가
        if (protectedMethods.includes(config.method?.toLowerCase()) && token) {
            config.headers['x-csrf-token'] = token;
            // 여기서 설정한 헤더의 이름이
            // doubleCsrf()에서의 getCsrfTokenFromRequest: (req) => req.headers["헤더이름"]의 헤더이름과 일치해야함
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