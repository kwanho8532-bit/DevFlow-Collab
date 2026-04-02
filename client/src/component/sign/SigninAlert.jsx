import { Alert } from "@mui/material";


{/* root 전체에서 보여줄 에러 메시지를 하나로 통합 */ }
export default function SigninAlert({ errors, clearErrors, reason }) {
    const message = {
        'root': errors?.root?.message,
        'root.auth': errors?.root?.auth?.message,
        'root.expired': errors?.root?.expired?.message
    }
    return (
        <Alert
            severity="error"
            onClose={() => clearErrors(reason)}
            sx={{
                position: 'absolute',
                top: -100,
                zIndex: 1,
                width: '100%'
            }}
        >
            {message[reason]}
        </Alert >
    )
}