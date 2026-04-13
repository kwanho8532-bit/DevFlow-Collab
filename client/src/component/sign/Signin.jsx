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
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useCallback } from "react";


export default function Signin() {
    const login = useAuthStore(state => state.login)
    const changeAuth = useAuthStore(state => state.changeAuth)
    const initCsrf = useAuthStore(state => state.initCsrf)
    const { state } = useLocation()
    const [searchParams] = useSearchParams()

    const [isLocked, setIsLocked] = useState(false)
    const [lockText, setLockText] = useState('Sign in')

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

    useEffect(() => {
        console.log('refresh')
        async function refresh() {
            await initCsrf()
        }
        refresh()
    }, [initCsrf])

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

    const handleButtonLock = useCallback((sec) => {
        setIsLocked(true)
        let timeLeft = sec

        const timer = setInterval(() => {
            timeLeft--
            setLockText(`${timeLeft}초 후에 다시 시도하십시오`)

            if (timeLeft <= 0) {
                clearInterval(timer)
                setIsLocked(false)
                setLockText('Sign in')
                localStorage.removeItem('login_lock_until')
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const lockUntil = localStorage.getItem('login_lock_until')

        if (lockUntil) {
            const remainingTime = Math.ceil((parseInt(lockUntil) - Date.now()) / 1000);

            if (remainingTime > 0) {
                handleButtonLock(remainingTime)
            } else {
                localStorage.removeItem('login_lock_until')
            }
        }
    }, [handleButtonLock])

    const handleRegistration = async (value) => {
        try {
            await login(value)
            changeAuth(data.user)
            navigate('/hub', {
                replace: true,
                state: { reason: 'SIGN_IN' }
            })
        } catch (err) {
            console.log(err)
            if (err.response.status === 429) {
                const retryAfter = err.response.headers['retry-after'] || 300
                const lockUntil = Date.now() + (parseInt(retryAfter) * 1000)
                localStorage.setItem('login_lock_until', lockUntil)
                handleButtonLock(retryAfter)
            }
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
        <>
            <Helmet>
                <title>DevFlow | 로그인</title>

                <meta
                    name="description"
                    content="DevFlow에 로그인하여 팀 프로젝트를 관리하고 동료들과 실시간으로 협업을 시작하세요."
                />

                <meta property="og:title" content="DevFlow - 로그인" />
                <meta
                    property="og:description"
                    content="로그인하고 우리 팀의 워크스페이스로 이동하세요."
                />
                <meta property="og:url" content="https://dev-flow-collab.duckdns.org/signin" />

                <link rel="canonical" href="https://dev-flow-collab.duckdns.org/signin" />
            </Helmet>

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
                                id="login-btn"
                                disabled={isLocked || !isValid}
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
                                {lockText}
                            </Button>
                        </Stack>

                    </Box>
                </Stack>
            </Box>
        </>
    )
}