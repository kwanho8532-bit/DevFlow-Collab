import { Navigate, useLocation } from "react-router"

export default function Hub() {
    const { state } = useLocation()

    const reason = state.reason
    const message = state.message

    switch (reason) {
        case 'REGISTER':
        case 'SIGN_IN':
            return <Navigate to='/landing' replace={true} />

        case 'UNAUTHENTICATE':
            return <Navigate to='/signin' replace={true} state={{ message }} />

        case 'PROJECT_DELETE':
            return <Navigate to='/dashboard' replace={true} />

        case 'ARCHIVED_PROJECT_DELETE':
            return <Navigate to='/archived' replace={true} />

    }


}
