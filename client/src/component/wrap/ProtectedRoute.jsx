import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";


export default function ProtectedRoute() {
    const auth = useAuthStore(state => state.auth, shallow)
    const checkAuth = useAuthStore(state => state.checkAuth, shallow)

    useEffect(() => {
        const interval = setInterval(() => {
            checkAuth()
            console.log(auth)
        }, 1000 * 60 * 5)

        // 해당 DashboardPage 컴포넌트가 언마운트 되면 인터벌 종료하도록 함 
        return () => clearInterval(interval)
    }, [checkAuth])
    // 의존성 배열에 checkAuth를 빼도 됨. => zustand 스토어 내부에 정의된 함수의 참조값은 변하지 않음
    // 따라서 checkAuth라는 함수의 참조값은 변경되지 않기 떄문에 []과 같이 첫 마운트 시 한번만 실행됨
    // 근데 리액트 공식 권장 사항(ESLint)은 "Effect 안에서 사용된 모든 외부 변수/함수는 의존성 배열에 넣으라"고
    // 가이드하기 때문에 리액트스럽게 만들기 위해 넣음

    if (!auth) {
        return (
            <Navigate
                to='/hub'
                replace={true}
                state={{
                    reason: 'UNAUTHENTICATE',
                    message: '로그인이 필요합니다.'
                }} />
        )
    }

    return <Outlet />
}