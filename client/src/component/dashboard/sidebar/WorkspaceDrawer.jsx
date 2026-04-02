import {
    Box, Divider, Drawer,
    InputAdornment, List, ListItem,
    ListItemButton, ListItemText, TextField,
    Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

import { useState } from "react";
import { useEffect } from "react";
import { useWorkspaceStore } from "../../../store/useWorkspaceStore.js";
import { Link } from "react-router-dom";
import { useProjectStore } from "../../../store/useProjectStore.js";
import CreateWorkspaceDialog from "../ProjectDetail/dialogs/CreateWorkspaceDialog.jsx";

export default function WorkspaceDrawer({ isDrawerOpen, setDrawerOpen, setIsNavOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const getAllWorkspaces = useWorkspaceStore(state => state.getAllWorkspaces)
    const setSelectedProjectInWorkspace = useProjectStore(state => state.setSelectedProjectInWorkspace)
    const getMyWorkspaces = useWorkspaceStore(state => state.getMyWorkspaces)
    const myWorkspaces = useWorkspaceStore(state => state.myWorkspaces)

    useEffect(() => {
        async function getWorkspaces() {
            await getAllWorkspaces()
            await getMyWorkspaces()
        }
        getWorkspaces()
    }, [getAllWorkspaces, getMyWorkspaces])

    const handleCreateDialogOpen = () => {
        setCreateDialogOpen(true)
    }

    const handleCreateDialogClose = () => {
        setCreateDialogOpen(false)
    }


    return (
        <Drawer
            disableRestoreFocus
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setDrawerOpen(false)}
            slotProps={{
                Paper: {
                    sx: {
                        width: 280,
                        bgcolor: '#252525',
                        color: '#fff',
                        ml: '70px'
                    }
                },
                backdrop: {
                    sx: { bgcolor: 'transparent' } // 서랍이 열려도 배경을 흐리게 하지 않으려면 투명하게 설정
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold' }}>
                    Workspaces
                </Typography>

                <TextField
                    autoFocus
                    autoComplete="off"
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: '1.2rem' }} />
                                </InputAdornment>
                            ),
                        },
                        // 실제 input 태그에 직접 스타일 주입
                        htmlInput: {
                            style: {
                                color: '#000',
                                backgroundColor: 'transparent', // 배경을 투명하게 해서 부모 Box 색이 보이게 함
                            }
                        }
                    }}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#F3F4F6', // 연한 회색 배경 (입력창 영역 구분)
                            color: '#1F2937',   // 실제 입력되는 글자색 (진한 검정)
                            borderRadius: '8px',
                            '& fieldset': { border: 'none' }, // 평소엔 테두리 없음
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': {
                                border: '1px solid #10B981', // 포커스 시 포인트 컬러 테두리
                            },
                        },
                        '& .MuiInputBase-input': {
                            '&::placeholder': {
                                color: '#9CA3AF', // 플레이스홀더: 연한 회색
                                opacity: 1,
                            },
                        }
                    }}
                />

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }} />

                {/* 워크스페이스 리스트 (예시 데이터) */}
                <List sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {myWorkspaces.map(workspace => (
                        <ListItem
                            key={workspace._id}
                            disablePadding
                            onClick={() => {
                                setDrawerOpen(false)
                                setSelectedProjectInWorkspace(null)
                                setIsNavOpen(true)
                            }
                            }
                            component={Link}
                            to={`/workspace/${workspace._id}`}>
                            <ListItemButton onClick={(e) => {
                                e.currentTarget.blur();
                            }}>
                                <ListItemText primary={workspace.workspaceName} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 1 }} />

                {/* 초대 기능: 워크스페이스 내부에 배치하여 맥락 유지 */}
                <ListItemButton
                    onClick={handleCreateDialogOpen}
                    sx={{ color: '#10B981' }}>
                    <ListItemText
                        primary="+ Create Workspace"
                        slotProps={{
                            primary: {
                                sx: {
                                    fontSize: '0.9rem', fontWeight: 'bold'
                                }
                            }
                        }} />
                </ListItemButton>
                <CreateWorkspaceDialog open={createDialogOpen} handleClose={handleCreateDialogClose} />
            </Box>
        </Drawer >
    )
}