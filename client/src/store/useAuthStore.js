import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../component/api/axios.js'

// 내일 와서 useAuthStore를 구성하는
// zustand, axios.interceptors, subscribeWithSelector, subscribe 등등 다시 연습하기
// Persist도 공부해보기 & 기존 context를 useAuthStore로 수정하기 

export const useAuthStore = create(
    persist((set) => ({
        auth: null,
        csrfToken: null,
        getAuth: async () => {
            try {
                const { data } = await api.get('/me/auth') // withCredentials: true는 기본값으로 설정함 axios.js에서 따라서 생략 가능
                set({ auth: data.user })
            } catch (err) {
                if (err.response?.status === 401) {
                    set({ auth: null });
                }
            }
        },
        checkAuth: async () => {
            try {
                const { data } = await api.get('/me/auth/status', {
                    headers: { 'x-skip-loading': 'true' }
                })
                set({ auth: data })
            } catch (err) {
                // 인터셉터에서 401 처리를 하므로 여기서는 특별한 로직이 없어도 되지만,
                // 상태 초기화를 여기서 한 번 더 해주면 더 안전합니다.
                console.log(err.response)
                set({ auth: null })
            }
        },
        changeAuth: (newAuth) => set({ auth: newAuth }),
        login: async (value) => {
            try {
                const { data } = await api.post('/signin', value)
                set({ csrfToken: data.csrfToken })
            } catch (err) {
                console.log(err)
            }
        },
        logout: async () => {
            try {
                const { data } = await api.post('/signout')
                set({ auth: data.user || null })
            } catch (err) {
                console.log(err)
            }
            set({ auth: null })
        },
        initCsrf: async () => {
            try {
                const { data } = await api.get('/csrf-token')
                set({ csrfToken: data })
            } catch (err) {
                console.log(err)
            }
        }
    }),
        {
            name: 'devFlow-auth-storage',
        }
    )
)


