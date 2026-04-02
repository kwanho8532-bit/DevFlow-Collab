import {
    Box, IconButton, Stack,
    Typography
} from "@mui/material";

import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import IconList from "./IconList";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import SendIcon from '@mui/icons-material/Send';

import { useState } from "react";
import InviteDialog from "../dialogs/InviteDialog";

// 개인 작업공간에서 workspace누르면 drawer가 나왔던것을 재활용해서
// 협업 공간에서도 동일하게 만들어서 workspace 간에 이동가능하도록 하기

// workspacePage에서 sidebar옆에 middle nav 만들고 이걸 토글할 수 있도록하기
// 내부 box를 둬서 해당 box의 높이를 calc(100vh - 48px) 이렇게 하고 alignItems: center
// 해서 중앙에 위치하도록 만들기
export default function Sidebar({ isNavOpen, setIsNavOpen }) {
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [findUserList, setFindUserList] = useState(null)

    const hanldeInviteOpen = () => {
        setInviteDialogOpen(true)
    }

    const hanldeInviteClose = () => {
        setInviteDialogOpen(false)
        setFindUserList(null)
    }

    const sideMenu = [
        { key: 'workspace', icon: <WorkspacesIcon fontSize="small" />, text: 'Workspace' },
        { key: 'personal', icon: <AccessibilityIcon fontSize="small" />, text: 'Personal', },
        { key: 'toggle projectList', icon: <ContentPasteSearchIcon fontSize="small" />, text: isNavOpen ? 'Close ProjectList' : 'Open ProjectList', },
        { key: 'invite', icon: <SendIcon fontSize="small" />, text: 'Invite' },
        { key: 'archive', icon: <InventoryIcon fontSize="small" />, text: 'Archive', },
        { key: 'home', icon: <HomeIcon fontSize="small" />, text: 'Landing' },
    ]

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%' }}>
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Stack
                    direction='column'
                    spacing={2}
                    justifyContent='center'
                    sx={{ height: '100%' }}

                >
                    {sideMenu.map(menu => (
                        <IconList
                            key={menu.key}
                            menu={menu}
                            isNavOpen={isNavOpen}
                            setIsNavOpen={setIsNavOpen}
                            handleInviteOpen={hanldeInviteOpen}
                        />
                    ))}

                    {/* add project는 middleNav 최상단에 만들기(sticky) */}
                </Stack>
            </Box>
            <InviteDialog
                open={inviteDialogOpen}
                handleClose={hanldeInviteClose}
                findUserList={findUserList}
                setFindUserList={setFindUserList}
            />
        </Box>
    )
}