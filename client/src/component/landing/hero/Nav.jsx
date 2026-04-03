import {
    Stack, Typography
} from "@mui/material";

import Diversity2Icon from '@mui/icons-material/Diversity2';

import { Link } from 'react-router'
import api from "../../api/axios.js";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { shallow } from "zustand/shallow";

export default function Nav() {
    const auth = useAuthStore(state => state.auth, shallow)
    const getAuth = useAuthStore(state => state.getAuth)
    const changeAuth = useAuthStore(state => state.changeAuth)

    useEffect(() => {
        async function getAuthFunc() {
            await getAuth()
        }
        getAuthFunc()
    }, [])

    const handleSignout = async () => {
        const { data } = await api.post('/signout', {}, { withCredentials: true })
        changeAuth(data.user)
    }

    return (
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ px: 1, pt: 1 }} >
            <Stack direction='row' spacing={1} alignItems='center'>
                <Diversity2Icon fontSize="medium" sx={{ color: 'white' }} />
                <Typography variant="h6" sx={{ color: 'white' }}>
                    DevFlow
                </Typography>
            </Stack>
            <Stack direction='row' spacing={2}>
                {auth ?
                    <>
                        <Typography
                            component={Link}
                            to='/dashboard'
                            sx={{
                                background: 'none',
                                border: 'none',
                                p: 0,
                                cursor: 'pointer',
                                color: '#ccc',
                                borderBottom: '2px solid transparent', // 미리 투명한 2px 공간 확보
                                transition: 'all 0.3s ease', // 0.3초 동안 부드럽게 변경
                                '&:hover': {
                                    color: 'white',
                                    borderBottomColor: 'white'
                                },
                                textDecoration: 'none'
                            }}>
                            DashBoard
                        </Typography>
                        <Typography
                            component='button'
                            to='/signin'
                            onClick={handleSignout}
                            sx={{
                                background: 'none',
                                border: 'none',
                                p: 0,
                                cursor: 'pointer',
                                color: '#ccc',
                                borderBottom: '2px solid transparent', // 미리 투명한 2px 공간 확보
                                transition: 'all 0.3s ease', // 0.3초 동안 부드럽게 변경
                                '&:hover': {
                                    color: 'white',
                                    borderBottomColor: 'white'
                                },
                                textDecoration: 'none'
                            }}>
                            Sign out
                        </Typography>
                    </>
                    :
                    <>
                        <Typography
                            component={Link}
                            to='/signin'
                            sx={{
                                color: '#ccc',
                                borderBottom: '2px solid transparent', // 미리 투명한 2px 공간 확보
                                transition: 'all 0.3s ease', // 0.3초 동안 부드럽게 변경
                                '&:hover': {
                                    color: 'white',
                                    borderBottomColor: 'white'
                                },
                                textDecoration: 'none'
                            }}>
                            Sign in
                        </Typography>
                        <Typography
                            component={Link}
                            to='/signup'
                            sx={{
                                color: '#ccc',
                                borderBottom: '2px solid transparent', // 미리 투명한 2px 공간 확보
                                transition: 'all 0.3s ease', // 0.3초 동안 부드럽게 변경
                                '&:hover': {
                                    color: 'white',
                                    borderBottomColor: 'white'
                                },
                                textDecoration: 'none'
                            }}>
                            Sign up
                        </Typography>
                    </>
                }

            </Stack>
        </Stack >
    )
}