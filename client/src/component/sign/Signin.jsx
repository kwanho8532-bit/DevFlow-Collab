import {
    Box, IconButton, Tooltip,
    Typography, TextField, Stack,
    Button
} from "@mui/material";

import Diversity2Icon from '@mui/icons-material/Diversity2';

import { useForm } from "react-hook-form";
import { signinSchema } from "../../schema/zod.js";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/axios.js";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useEffect } from "react";
import SigninAlert from "./SigninAlert.jsx";


export default function Signin() {
    const changeAuth = useAuthStore(state => state.changeAuth)
    const { state } = useLocation()

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { isValid, errors },
        clearErrors
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: { email: '', password: '' },
        resolver: zodResolver(signinSchema),
        resetOptions: { keepErrors: true }
    })

    const [searchParams] = useSearchParams()

    const errorReason = searchParams.get('error')

    useEffect(() => {
        if (errorReason === 'auth_expired') {
            setError('root.expired', {
                type: 'session_expire',
                message: '인증 정보가 만료되었습니다.'
            })
        }
        if (state) {
            setError('root.auth', {
                type: 'unauthenticate',
                message: state.message
            })
        }
    }, [state, setError])


    const navigate = useNavigate()


    const handleRegistration = async (value) => {
        try {
            const { data } = await api.post('/signin', value)
            changeAuth(data.user)
            navigate('/hub', {
                replace: true,
                state: { reason: 'SIGN_IN' }
            })
        } catch (err) {
            setError('root', {
                type: 'server',
                message: err.response?.data.message
            })
            reset()
        }

    }

    const errorConfigs = [
        { field: errors?.root, reason: 'root' },
        { field: errors?.root?.auth, reason: 'root.auth' },
        { field: errors?.root?.expired, reason: 'root.expired' },
    ]

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transform: { xs: 'scale(0.7)', md: 'scale(0.85)' }, // 전체를 85~90% 크기로 축소
            transformOrigin: 'center', // 중앙을 기준으로 축소
        }}>
            <Stack sx={{ position: 'relative' }}>

                {/* error 종류가 3개로 늘어나서 그냥 컴포넌트로 따로 뺌 */}
                {errorConfigs.map(({ field, reason }) =>
                    field?.message
                    &&
                    <SigninAlert
                        key={reason}
                        reason={reason}
                        errors={errors}
                        clearErrors={clearErrors}
                    />
                )}

                <Tooltip title='Go to Landing'>
                    <IconButton sx={{ mb: 2 }} component={Link} to='/landing'>
                        <Diversity2Icon fontSize="large" />
                    </IconButton>
                </Tooltip>

                <Typography variant="h4" sx={{ mb: 2 }}>
                    Welcome Back!
                </Typography>

                <Box
                    onSubmit={handleSubmit(handleRegistration)}
                    component="form"
                    noValidate
                    autoComplete="off"
                >
                    <Stack direction='column' spacing={1} >
                        <TextField
                            {...register('email')}
                            type='email'
                            id="email"
                            label="Email"
                            variant="outlined"
                            error={!!errors?.email}
                            helperText={errors?.email?.message || ' '}
                        />
                        <TextField
                            {...register('password')}
                            type="password"
                            id="password"
                            label="Password"
                            variant="outlined"
                            error={!!errors?.password}
                            helperText={errors?.password?.message || ' '}
                        />
                        <Button
                            disabled={!isValid}
                            type="submit"
                            size="large"
                            sx={{
                                borderRadius: '999px',
                                bgcolor: '#000',
                                color: '#fff',
                                '&.Mui-disabled': {
                                    bgcolor: 'rgba(0, 0, 0, 0.12)',
                                    color: 'rgba(0, 0, 0, 0.26)',
                                }
                            }}
                        >
                            Sign in
                        </Button>
                    </Stack>

                </Box>
            </Stack>
        </Box>
    )
}