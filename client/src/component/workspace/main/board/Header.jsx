import {
    Box, Stack, TextField,
    InputAdornment, IconButton, Tooltip,
    AvatarGroup,
    Avatar,
} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import MessageIcon from '@mui/icons-material/Message';
import MailIcon from '@mui/icons-material/Mail';

import { useSearchStore } from "../../../../store/useSearchStore";
import { useNavigate } from "react-router-dom";
import { useWorkspaceStore } from "../../../../store/useWorkspaceStore";
import { useEffect } from "react";

export default function Header() {
    const searchQuery = useSearchStore(state => state.searchQuery)
    const setSearchQuery = useSearchStore(state => state.setSearchQuery)
    const selectedWorkspace = useWorkspaceStore(state => state.selectedWorkspace)
    const getWorkspaceMember = useWorkspaceStore(state => state.getWorkspaceMember)
    const selectedWorkspaceMember = useWorkspaceStore(state => state.selectedWorkspaceMember)

    const navigate = useNavigate()

    useEffect(() => {
        if (!selectedWorkspace) return
        async function getMember() {
            await getWorkspaceMember(selectedWorkspace._id)
        }
        getMember()
    }, [getWorkspaceMember, selectedWorkspace])

    const menu = [
        { key: 'inviteBox', icon: <MailIcon fontSize="small" />, text: 'InviteBox', },
        { key: 'message', icon: <MessageIcon fontSize="small" />, text: 'Message', },
    ]

    // 여기에 switch문으로 action 정의하기 & inviteBox만들어서 초대와 연결시키기
    const menuAction = (key) => {
        switch (key) {
            case 'inviteBox':
                navigate('/invite-box')
                break;

            case 'message':
                navigate('/messages')
                break;

            default:
                console.log('menuAction default')
                break;
        }
    }

    console.log(selectedWorkspaceMember)

    return (
        // #eee를 rgb로 변환한 값: 238,238,238
        <Box sx={{ width: '100%', height: '100%' }}>
            <Stack direction='row' alignItems='center' justifyContent='center' sx={{ height: '100%', width: '100%', px: 2 }}>
                {/* 검색창의 중앙정렬을 유지하면서 menu를 flex-end에 놓기 위해 빈 Box를 둠 */}
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', borderRadius: '12px', }}>
                    <AvatarGroup
                        max={4}
                        sx={{
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                fontSize: 12,
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                            }
                        }}>
                        {/* 나중에 뭐 클릭하면 작은 dialog처럼(dialog는 아니지만...) 띄워서 email, message를 누르면 
                         email이나 message보내는 페이지로 이동해서 보낼 수 있도록 만들 수도 있을 듯*/}
                        {selectedWorkspaceMember.map(member => (
                            <Tooltip title={member.username}>
                                <Avatar
                                    alt={member.username}
                                    src={member.profileImg}
                                />
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                </Box>
                <TextField
                    size="small"
                    placeholder="Search projects..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        width: '500px',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', // 헤더가 딥 그린일 경우 살짝 투명하게
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-root': {
                            color: 'white', // 글자색
                            '& fieldset': { border: 'none' }, // 테두리 제거 (선택 사항)
                            '&:hover fieldset': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)', // 플레이스홀더 색상
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                </InputAdornment>
                            ),
                        }
                    }}
                />
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end'
                }}>
                    {menu.map(menu => (
                        <Stack key={menu.key} direction='column'>
                            <Tooltip title={menu.text}>
                                <IconButton
                                    onClick={() => menuAction(menu.key)}
                                    className='icon-box'
                                    sx={{
                                        p: 1,
                                        display: 'flex',
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        color: 'rgba(204,204,204,0.8)',
                                        '&:hover': {
                                            color: '#fff'
                                        }
                                    }}>
                                    {menu.icon}
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    ))}
                </Box>
            </Stack>

            <Stack>

            </Stack>

        </Box>

    )
}