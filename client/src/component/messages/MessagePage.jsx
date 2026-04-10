import {
    Box, Typography, Stack,
    IconButton,
} from '@mui/material';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useChatStore } from '../../store/useChatStore.js';
import MessageList from './MessageList.jsx';
import MessageChat from './MessageChat.jsx';
import { useAuthStore } from '../../store/useAuthStore.js';

export default function MessagePage() {
    const [userList, setUserList] = useState(null)

    const getChatRooms = useChatStore(state => state.getChatRooms)
    const initCsrf = useAuthStore(state => state.initCsrf)

    const navigate = useNavigate()

    useEffect(() => {
        async function refresh() {
            await initCsrf()
        }
        refresh()
    }, [initCsrf])

    useEffect(() => {
        async function getChats() {
            await getChatRooms()
        }
        getChats()
    }, [getChatRooms])

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            p: 4,
            bgcolor: '#F8FAFC', // 더 부드러운 화이트 그레이
            overflow: 'hidden'
        }}>

            <Stack direction="column" spacing={3}>
                {/* 🟢 1. Header: 풍부한 감성의 헤더 */}
                <Stack direction='row' spacing={2}>
                    {/* 뒤로가기 버튼: 부드러운 배경색과 호버 효과 */}
                    <Stack direction='row' alignItems='center'>
                        <IconButton
                            onClick={() => navigate(-1)} // 이전 페이지로 이동
                            sx={{
                                bgcolor: '#FFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                p: 1.2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                '&:hover': {
                                    bgcolor: '#F1F5F9',
                                    transform: 'translateX(-3px)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 18, color: '#1E293B' }} />
                        </IconButton>
                    </Stack>
                    <Box>
                        <Typography variant="h3" sx={{
                            fontWeight: 900,
                            color: '#1E293B',
                            letterSpacing: '-1.5px',
                            lineHeight: 1.2
                        }}>
                            Messages
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
                            팀원들과 소중한 아이디어를 실시간으로 나누어 보세요. ✨
                        </Typography>
                    </Box>
                </Stack>

                <MessageList
                    userList={userList}
                    setUserList={setUserList}
                />
            </Stack>

            {/* 🔵 2. Content Section: 부드러운 곡률의 카드 */}
            <Box sx={{ display: 'flex', flexGrow: 1, gap: 4, overflow: 'hidden' }}>

                {/* 👈 좌측: 메시지 목록 (Soft Card) */}


                {/* 👉 우측: 메시지 상세 (Modern Display) */}
                <MessageChat />
            </Box >

            {/* 부드러운 모핑 애니메이션 정의 */}
            <style> {`
        @keyframes morph {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
          67% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
        }
      `}
            </style>
        </Box >
    );
};
