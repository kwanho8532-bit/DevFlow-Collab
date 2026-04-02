import {
    Box, Typography, Paper,
    Stack, Button, Avatar,
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useInviteStore } from "../../../../store/useInviteStore.js"
import dayjs from 'dayjs';
import { useState } from 'react';
import { useWorkspaceStore } from '../../../../store/useWorkspaceStore.js';
import { useSnackbarStore } from '../../../../store/useSnackbarStore.js';


export default function Invite() {
    const invites = useInviteStore(state => state.invites)
    const acceptAndJoin = useWorkspaceStore(state => state.acceptAndJoin)
    const snackbarOpen = useSnackbarStore(state => state.snackbarOpen)

    const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)

    const handleAcceptDialogOpen = () => {
        setAcceptDialogOpen(true)
    }

    const handleAcceptDialogClose = () => {
        setAcceptDialogOpen(false)
    }

    // 요청 수락 & 거절 로직 만들기 (수락 시 해당 workspace로 이동하기 & workspaceMember 생성)
    const handleAccept = async (inviteId) => {
        const result = await acceptAndJoin(inviteId)
        snackbarOpen(result.message, result.success ? 'success' : 'error')
    }


    return (
        <Stack spacing={3}>
            {invites.map((invite) => (
                <Paper
                    key={invite._id}
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 5,
                        border: '1px solid #E5E7EB',
                        bgcolor: '#fff',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        gap: 3,
                        transition: '0.3s ease',
                        '&:hover': { transform: 'scale(1.01)', boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }
                    }}
                >
                    {/* Avatar & Info (Flex) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, width: '100%' }}>
                        <Avatar
                            src={invite.invitor?.profileImg}
                            sx={{ width: 64, height: 64, border: '3px solid #F3F4F6' }}

                            alt={invite.invitor.username}
                        />
                        <Box>
                            <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
                                {invite.workspace.workspaceName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                <b>{invite.invitor?.username}</b> 님이 보낸 초대
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#4c1d95', fontWeight: 700 }}>
                                {dayjs(invite.createAt).format('YYYY.MM.DD')} 도착
                            </Typography>
                        </Box>
                    </Box>

                    {/* Action Buttons (Flex) */}
                    <Box sx={{
                        display: 'flex',
                        gap: 1.5,
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: 'flex-end'
                    }}>
                        <Button
                            onClick={() => handleAccept(invite._id)}
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            sx={{
                                bgcolor: '#111827',
                                color: '#fff',
                                px: 3,
                                py: 1.2,
                                borderRadius: 3,
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#374151' },
                                minWidth: '120px'
                            }}
                        >
                            Accept
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            sx={{
                                color: '#6B7280',
                                borderColor: '#E5E7EB',
                                px: 3,
                                py: 1.2,
                                borderRadius: 3,
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: '#F9FAFB',
                                    borderColor: '#D1D5DB'
                                },
                                minWidth: '120px'
                            }}
                        >
                            Decline
                        </Button>
                    </Box>
                </Paper>
            ))}

        </Stack>
    )
}