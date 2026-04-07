import {
    Box, Typography, Tooltip,
    IconButton, TextField, Stack,
    Paper, Button, Alert
} from "@mui/material";
import MuiLink from '@mui/material/Link';

import Diversity2Icon from '@mui/icons-material/Diversity2';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import { useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from "../../schema/zod.js";

import api from "../api/axios.js";
import Spinner from "../etc/Spinner.jsx";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useLoadingStore } from "../../store/useLoadingStore.js";
import { Helmet } from "react-helmet-async";

// 로그아웃까지 구현 했으니까 로그인 구현해야됨
// 이후에 landing 컨텐츠 더 만들고 

export default function Signup() {
    const changeAuth = useAuthStore(state => state.changeAuth)
    const loading = useLoadingStore(state => state.isLoading)
    const navigate = useNavigate()

    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { isValid, errors },
        setError,
        clearErrors
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: { username: '', email: '' },
        resolver: zodResolver(signupSchema),
        resetOptions: { keepErrors: true }
    })

    const handleRegistration = async (data) => {
        const formData = new FormData()

        Object.keys(data).forEach((key) => {
            if (key === 'profileImg') {
                const file = data[key]?.[0]

                if (file) {
                    formData.append(key, file)
                }
            } else {
                formData.append(key, data[key])
            }
        })

        try {
            const res = await api.post('/signup', formData)
            changeAuth(res.data.user)
            if (res.data.action === 'REDIRECT') {
                navigate('/hub', {
                    replace: true,
                    state: { reason: 'REGISTER' }
                })
            } else {
                throw new Error('handleRegistration Error!')
            }
        } catch (err) {
            setError('root', {
                type: 'server',
                message: err.response.data.message
            })
            reset()
        }
    }

    return (
        <>
            <Helmet>
                <title>DevFlow | 회원가입</title>

                <meta name="description" content="지금 DevFlow에 가입하고 스타트업을 위한 최적의 협업 환경을 경험해보세요. 무료로 시작할 수 있습니다." />

                <meta property="og:title" content="DevFlow - 회원가입" />
                <meta property="og:description" content="팀원들과 함께할 준비가 되셨나요? 지금 바로 가입하세요!" />
                <meta property="og:url" content="https://dev-flow-collab.duckdns.org/signup" />

                <link rel="canonical" href="https://dev-flow-collab.duckdns.org/signup" />
            </Helmet>


            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {loading && <Spinner content='회원가입 중' />}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        maxWidth: '450px',
                        transform: { xs: 'scale(0.7)', md: 'scale(0.85)' }, // 전체를 85~90% 크기로 축소
                        transformOrigin: 'center', // 중앙을 기준으로 축소
                    }}>

                    {errors?.root
                        &&
                        <Alert
                            severity="error"
                            onClose={() => clearErrors('root')}
                            sx={{ position: 'absolute', top: -100, zIndex: 1, width: '100%' }}
                        >
                            {errors?.root.message}
                        </Alert>
                    }

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title='Go to Landing'>
                            <IconButton sx={{ mb: 2 }} component={Link} to='/landing'>
                                <Diversity2Icon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Typography variant="h4" textAlign='center' sx={{ fontWeight: 'bold', mb: 2 }}>
                        Welcome to DevFlow
                    </Typography>

                    <Typography variant="body1" textAlign='center' sx={{ mb: 3 }}>
                        Create your account and increase your productivity
                    </Typography>

                    <Box
                        onSubmit={handleSubmit(handleRegistration)}
                        component="form"
                        noValidate
                        autoComplete="off"
                    >
                        <Stack direction='column' spacing={1}>
                            <TextField
                                fullWidth
                                {...register('username')}
                                id="username"
                                label="Username"
                                variant="outlined"
                                error={!!errors?.username}
                                helperText={errors?.username?.message || ' '}
                            />
                            <TextField
                                fullWidth
                                {...register('email')}
                                type="email"
                                id="email"
                                label="Email"
                                variant="outlined"
                                error={!!errors?.email}
                                helperText={errors?.email?.message || ' '}
                            />
                            <TextField
                                fullWidth
                                {...register('password')}
                                type="password"
                                id="password"
                                label="Password"
                                variant="outlined"
                                error={!!errors?.password}
                                helperText={errors?.password?.message || ' '}
                            />
                            <Controller
                                control={control}
                                name="profileImg"
                                defaultValue={[]}
                                render={({ field: { onChange, value } }) => {
                                    const onDrop = useCallback((acceptedFile) => {
                                        onChange(acceptedFile)
                                    }, [onChange])

                                    const { getRootProps, getInputProps, isDragActive } = useDropzone({
                                        onDrop,
                                        accept: {
                                            'image/jpeg': ['.jpeg'],
                                            'image/jpg': ['.jpg'],
                                            'image/png': ['.png'],
                                            'image/gif': ['.gif'],
                                        },
                                        multiple: false,
                                        maxFiles: 1
                                    })

                                    const resetFile = (e) => {
                                        e.stopPropagation()
                                        onChange([])
                                    }

                                    return (
                                        <Paper
                                            {...getRootProps()}
                                            elevation={4}
                                            sx={{
                                                p: 2,
                                                border: '2px dashed #aaa',
                                                '&:hover': { borderColor: 'primary.main' },
                                                bgcolor: isDragActive ? '#f0f8ff' : '#fafafa',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <input type="file" {...getInputProps()} />

                                            <Stack direction='row' justifyContent='space-evenly' alignItems='center'>
                                                <CloudUploadIcon sx={{ color: 'action.active' }} />
                                                <Typography variant="body1">
                                                    {value.length ?
                                                        value[0].name
                                                        :
                                                        '프로필 사진을 선택해주세요'
                                                    }
                                                </Typography>
                                                <Tooltip title='reset file'>
                                                    <IconButton onClick={resetFile}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>

                                        </Paper>
                                    )

                                }}
                            />


                        </Stack>

                        <Button
                            fullWidth
                            disabled={!isValid}
                            type="submit"
                            size="large"
                            sx={{
                                mt: 3,
                                borderRadius: '999px',
                                bgcolor: '#000',
                                color: '#fff',
                                '&.Mui-disabled': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.12)', // 연한 회색
                                    color: 'rgba(0, 0, 0, 0.26)',
                                }
                            }}>
                            Sign up
                        </Button>
                    </Box>
                    <Box>
                        <MuiLink component={Link} to='/signin' sx={{ display: 'flex', justifySelf: 'center', mt: 2 }}>
                            이미 계정이 있으신가요?
                        </MuiLink>
                    </Box>
                </Box>
            </Box >
        </>
    )
}