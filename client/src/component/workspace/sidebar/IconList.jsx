import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import WorkspaceDrawer from '../../dashboard/sidebar/WorkspaceDrawer';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '../../../store/useProjectStore';
import { useWorkspaceStore } from '../../../store/useWorkspaceStore';


export default function IconList({ menu, isNavOpen, setIsNavOpen, handleInviteOpen }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const setSelectedProjectInWorkspace = useProjectStore(state => state.setSelectedProjectInWorkspace)
    const clearSelectedWorkspace = useWorkspaceStore(state => state.clearSelectedWorkspace)

    const menuAction = (key) => {
        switch (key) {
            case 'workspace':
                setDrawerOpen(true)
                break;

            case 'personal':
                navigate('/dashboard')
                break;

            case 'toggle projectList':
                setIsNavOpen(!isNavOpen)
                break;

            case 'invite':
                handleInviteOpen()
                break;

            case 'archive':
                setSelectedProjectInWorkspace(null)
                navigate(`/workspace/${id}/archive`)
                break;

            case 'home':
                navigate('/landing')

            default:
                console.log('menu action is not work')

            //     { key: 'workspace', icon: <WorkspacesIcon fontSize="small" />, text: 'Workspace' },
            //     { key: 'personal', icon: <AccessibilityIcon fontSize="small" />, text: 'Personal', },
            //     { key: 'open projects', icon: <ContentPasteSearchIcon fontSize="small" />, text: 'Open Projects', },
            //     { key: 'archive', icon: <InventoryIcon fontSize="small" />, text: 'Archive', },
            //     { key: 'alert', icon: <NotificationsIcon fontSize="small" />, text: 'Update', },
            //     { key: 'message', icon: <MessageIcon fontSize="small" />, text: 'Message', },
            //     { key: 'home', icon: <HomeIcon fontSize="small" />, text: 'Landing' },

        }
    }
    return (
        <>
            <Stack
                direction='column'
                alignItems='center'
                onClick={() => menuAction(menu.key)}
                sx={{
                    cursor: 'pointer',
                    "&:hover .icon-box": { bgcolor: 'rgba(255,255,255, 0.1)', transform: 'translateY(-2px)' },
                    "&:hover .menu-text": { color: '#fff' }
                }}>
                <Box
                    className='icon-box'
                    sx={{
                        p: 1,
                        display: 'flex',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        color: 'rgba(204,204,204,0.8)'
                    }}>
                    {menu.icon}
                </Box>
                <Typography className='menu-text' variant="caption" textAlign='center' sx={{ color: 'rgba(204,204,204,0.6)', fontSize: '0.7rem' }}>
                    {menu.text}
                </Typography>
            </Stack >
            <WorkspaceDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} setIsNavOpen={setIsNavOpen} />
        </>
    )
}