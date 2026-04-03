import {
    Box, Avatar, Stack,
    Typography
} from "@mui/material";

import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import MailIcon from '@mui/icons-material/Mail';

import { useAuthStore } from "../../../store/useAuthStore.js";
import { useState } from "react";
import AddProject from "../AddProject.jsx";
import { useNavigate, } from "react-router-dom";
import { shallow } from 'zustand/shallow'
import WorkspaceDrawer from "./WorkspaceDrawer.jsx";

export default function Sidebar() {
    const auth = useAuthStore(state => state.auth, shallow)

    const [open, setOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate()

    const handleAddProject = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // 1. 동작 분기 처리 (onClick 하나로 관리)
    const handleMenuAction = (key) => {
        switch (key) {
            case 'workspace':
                setDrawerOpen(true); // 워크스페이스 서랍 열기
                break;

            case 'addProject':
                handleAddProject()
                break;

            case 'kanban':
                navigate('/dashboard')
                break;

            case 'inviteBox':
                navigate('/invite-box')
                break;

            case 'archive':
                navigate('/archived')
                break;

            case 'message':
                navigate('/messages')
                break;

            case 'home':
                navigate('/landing');
                break;

            default:
                break;
        }
    };

    // 2. 메뉴 구성 데이터 (UI와 액션 키만 정의)
    const sideMenu = [
        { key: 'workspace', icon: <WorkspacesIcon fontSize="small" />, text: 'Workspace' },
        { key: 'addProject', icon: <NoteAddIcon fontSize="small" />, text: 'Add Project' },
        { key: 'kanban', icon: <ContentPasteIcon fontSize="small" />, text: 'Kanban', to: '/dashboard' },
        { key: 'inviteBox', icon: <MailIcon fontSize="small" />, text: 'InviteBox', to: '/invite-box' },
        { key: 'archive', icon: <InventoryIcon fontSize="small" />, text: 'Archive', to: '/archived' },
        { key: 'message', icon: <MessageIcon fontSize="small" />, text: 'Message', to: '/messages' },
        { key: 'home', icon: <HomeIcon fontSize="small" />, text: 'Landing' },
    ];

    // 주소가 archived일 때 add Project를 누르면 dialog띄워서
    // kanban board로 이동해야 가능하다는 문구를 랜더하고, 이동 버튼 랜더링


    return (
        <Box
            sx={{
                height: '100vh',
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#ECFDF5', // 텍스트 기본색을 밝은 색으로 고정
                overflow: 'hidden',
            }}
        >
            {auth ?
                <>
                    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column' }}>
                        <Avatar
                            alt={auth?.username}
                            src={auth?.profileImg}
                            variant="rounded"
                            sx={{
                                width: 60,
                                height: 60,
                                border: '2px solid rgba(236, 253, 245, 0.5)', // 연한 테두리
                                boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', // 그림자 효과
                            }}
                        />
                        <Typography variant="caption" textAlign='center' sx={{ fontSize: '0.75rem', }}>
                            {auth?.username}
                        </Typography>
                    </Box>
                    <Stack
                        spacing={2}
                        sx={{
                            flexGrow: 1,        // 남은 공간을 모두 차지
                            overflowY: 'auto',   // 내용이 많아지면 세로 스크롤 생성
                            overflowX: 'hidden',
                            px: 1,               // 호버 시 배경색이 잘리지 않게 여유분
                            // 스크롤바 커스텀 (숨기고 싶으면 display: 'none' 처리 가능)
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '10px' },
                            '&:hover::-webkit-scrollbar-thumb': {
                                bgcolor: 'rgba(255, 255, 255, 0.4)', // 마우스 올리면 선명하게
                            },
                        }}
                    >
                        {sideMenu.map((item) => (
                            <Stack
                                key={item.key}
                                onClick={() => handleMenuAction(item.key)}
                                alignItems="center"
                                sx={{
                                    cursor: 'pointer',
                                    flexShrink: 0, // 중요: 스크롤 안에서 아이템이 찌그러지지 않게 함
                                    '&:hover .icon-box': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-2px)' },
                                    '&:hover .menu-text': { color: '#fff' },
                                }}
                            >
                                <Box
                                    className="icon-box"
                                    sx={{
                                        p: 1.2,
                                        borderRadius: 2,
                                        display: 'flex',
                                        transition: 'all 0.2s',
                                        color: 'rgba(204,204,204,0.8)'
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography className="menu-text" variant="caption" sx={{ color: 'rgba(204,204,204,0.6)', fontSize: '0.7rem' }}>
                                    {item.text}
                                </Typography>
                            </Stack>
                        ))}

                        <AddProject open={open} handleClose={handleClose} />
                        <WorkspaceDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />

                    </Stack>
                </>
                :
                null
            }
        </Box >
    )
}