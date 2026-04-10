import {
    Box, Typography, IconButton,
    Paper, Divider, Container,
    Chip, Tooltip
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { useInviteStore } from '../../../../store/useInviteStore.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Invite from './Invite.jsx';
import { useAuthStore } from '../../../../store/useAuthStore.js';

export default function InviteInbox() {
    const invites = useInviteStore(state => state.invites)
    const getPendingInvites = useInviteStore(state => state.getPendingInvites)
    const initCsrf = useAuthStore(state => state.initCsrf)

    const navigate = useNavigate()

    useEffect(() => {
        async function refresh() {
            await initCsrf()
        }
        refresh()
    }, [initCsrf])

    useEffect(() => {
        const getInviteData = async () => {
            await getPendingInvites()
        }
        getInviteData()
    }, [getPendingInvites])


    return (
        <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100vh', py: { xs: 4, md: 8 } }}>
            <Container maxWidth="lg">

                {/* --- 상단 헤더 영역 (Flex) --- */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 5,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Tooltip title='뒤로가기'>
                            <IconButton
                                // navigate(-1)는 히스토리 한 칸 뒤로 이동   
                                onClick={() => navigate(-1)}
                                sx={{
                                    bgcolor: '#fff',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    '&:hover': { bgcolor: '#f8f8f8', transform: 'translateX(-3px)' },
                                    transition: '0.2s'
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-1px' }}>
                                Invitations
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                새로운 워크스페이스 초대 목록입니다. <br />
                                멤버로 합류하여 협업을 시작해보세요.
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={`Pending: ${invites.length}`}
                        sx={{
                            bgcolor: '#4c1d95',
                            color: '#fff',
                            fontWeight: 700,
                            px: 1
                        }}
                    />
                </Box>

                {/* --- 메인 컨텐츠 영역 (Flex Container) --- */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, // 모바일에선 세로, 데스크탑에선 가로
                    gap: 4,
                    alignItems: 'flex-start'
                }}>

                    {/* --- Left Content: Info Sidebar (Flex-basis: 30%) --- */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 320px' }, }}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #E5E7EB', bgcolor: '#fff' }}>
                            <GroupAddIcon sx={{ fontSize: 40, color: '#4c1d95', mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1.5 }}>협업의 시작!</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                                새로운 워크스페이스에 참여하여 팀원들과 <b>DevFlow</b>의 실시간 보드 기능을 경험해보세요.
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 600 }}>
                                    💡 팁: 초대를 거절해도 상대방에게 알림이 가지 않으니 안심하세요.                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* --- Right Content: Main List (Flex-grow: 1) --- */}
                    <Box sx={{ flex: 1, width: '100%' }}>
                        {(!invites || invites.length === 0) ? (
                            <Paper sx={{
                                py: 15,
                                textAlign: 'center',
                                borderRadius: 6,
                                bgcolor: 'rgba(255,255,255,0.5)',
                                border: '2px dashed #D1D5DB'
                            }}>
                                <MailOutlineIcon sx={{ fontSize: 60, color: '#9CA3AF', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold">받은 초대가 없습니다.</Typography>
                                <Typography variant="body2" color="text.secondary">초대받은 워크스페이스가 생기면 알려드릴게요.</Typography>
                            </Paper>
                        ) :
                            // 초대 컴포넌트 accept와 decline버튼이 함께 들어있음
                            <Invite />
                        }
                    </Box>
                </Box >
            </Container >
        </Box >
    );
}