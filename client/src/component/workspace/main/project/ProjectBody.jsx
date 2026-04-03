import {
    Button, Paper, Stack,
    Tooltip, Typography,
} from "@mui/material";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useState } from "react";
import DeleteProjectDialog from "../../dialogs/DeleteProjectDialog.jsx";
import EditProjectDialog from "../../dialogs/EditProjectDialog.jsx";
import { useProjectStore } from "../../../../store/useProjectStore.js";
import StatusTransitionConfirm from "../../dialogs/StatusTransitionConfirm.jsx";
import ArchivedConfirm from "../../dialogs/ArchivedConfirm.jsx";
import EditProjectAlertDialog from "../../dialogs/EditProjectAlertDialog.jsx";

export default function ProjectBody({ isDoneOrArchive }) {
    const selectedProject = useProjectStore(state => state.selectedProjectInWorkspace)

    const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false)
    const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false)
    const [statusTransitionConfirmOpen, setStatusTransitionConfirmOpen] = useState(false)
    const [archivedConfirmOpen, setArchivedConfirmOpen] = useState(false)
    const [overdueAlertOpen, setOverdueAlertOpen] = useState(false)

    // isDoneOrArchive를 활용해서 done이나 archive 되었을 때 edit버튼을 
    // 클릭했을 떄 OverdueOrStatusAlertDialog가 뜨도록 만들기

    const handleEditProjectOpen = () => {
        if (isDoneOrArchive) {
            return handleOverdueAlertOpen()
        }
        setEditProjectDialogOpen(true)
    }

    const handleEditProjectClose = () => {
        setEditProjectDialogOpen(false)
    }

    const handleDeleteProjectDialogOpen = () => {
        setDeleteProjectDialogOpen(true)

    }

    const handleDeleteProjectDialogClose = () => {
        setDeleteProjectDialogOpen(false)
    }

    const handleStatusTransitionOpen = () => {
        setStatusTransitionConfirmOpen(true)
    }

    const handleStatusTransitionClose = () => {
        setStatusTransitionConfirmOpen(false)
    }

    const handleArchivedConfirmOpen = () => {
        // 백엔드에서 권한을 검사함
        setArchivedConfirmOpen(true)
    }

    const handleArchivedConfirmClose = () => {
        setArchivedConfirmOpen(false)
    }

    const handleOverdueAlertOpen = () => {
        setOverdueAlertOpen(true)
    }

    const handleOverdueAlertClose = () => {
        setOverdueAlertOpen(false)
    }

    const STATUS_TRANSITION = {
        PLANNING: 'IN_PROGRESS',
        IN_PROGRESS: 'DONE',
        DONE: 'ARCHIVED'
    }

    const nextStatus = STATUS_TRANSITION[selectedProject.status]

    const handleStatusTransition = async (nextStatus) => {
        try {
            handleStatusTransitionOpen()
        } catch (err) {
            console.log(err)
        }
    }

    // 사이드 바에서 archived 누르면 Link를 통해 라우트가 /workspace/workspaceId.../archived
    // 이렇게 만들어서 해당 workspace의 archived project를 랜더링하기

    return (
        <>
            <Stack direction='row' justifyContent='space-between'>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    Description
                </Typography>
                {/* {auth._id === selectedProject.owner._id && */}
                <Stack direction='row' spacing={1}>
                    <Tooltip title='project edit'>
                        <Button
                            onClick={handleEditProjectOpen}
                            sx={{
                                borderRadius: '999px',
                                bgcolor: '#4c1c94',
                                color: '#F9F8F6',
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#3A1572' }
                            }}>
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title='project delete'>
                        <Button
                            onClick={handleDeleteProjectDialogOpen}
                            sx={{
                                borderRadius: '999px',
                                bgcolor: '#d42f2f',
                                color: '#F9F8F6',
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#B71C1C' }
                            }}>
                            delete
                        </Button>
                    </Tooltip>
                </Stack>
                {/* } */}
            </Stack>
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    whiteSpace: 'pre-line',
                    flex: 1,
                    minHeight: 0,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': { width: '3px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '10px' },
                    '&:hover::-webkit-scrollbar-thumb': {
                        bgcolor: 'rgba(0, 0, 0, 0.5)', // 마우스 올리면 선명하게
                    },
                }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {selectedProject.description}
                </Typography>
            </Paper>

            {/* 일정 및 정보 카드 */}
            <Stack direction="row" spacing={2}>
                <Paper variant="outlined" sx={{ p: 2, flex: 1, borderRadius: 2 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        color="text.secondary"
                        sx={{
                            mb: 1,

                        }}>
                        <CalendarMonthIcon fontSize="small" />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>생성일</Typography>
                    </Stack>
                    <Typography variant="body2">{new Date(selectedProject.createAt).toLocaleDateString()}</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, flex: 1, borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary" sx={{ mb: 1 }}>
                        <CalendarMonthIcon fontSize="small" color="error" />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>마감일</Typography>
                    </Stack>
                    <Typography variant="body2">{new Date(selectedProject.deadline).toLocaleDateString()}</Typography>
                </Paper>
            </Stack>

            {/* {auth._id === selectedProject.owner._id && */}
            {/* // status transition */}
            <Stack direction='column'>
                <Paper variant="outlined" sx={{ p: 2, flex: 1, borderRadius: 2 }}>
                    {/* 여기 구조 잡고 project의 status를 변경하는 로직 구현하기 */}
                    <Stack direction='row' alignItems='center' spacing={3}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                fontWeight: 700,
                                borderRight: '2px solid #666',
                                pr: 2
                            }}>
                            Status Transition
                        </Typography>

                        <Stack direction='row' spacing={2}>
                            {nextStatus ?
                                <Button
                                    id={nextStatus}
                                    onClick={() => handleStatusTransition(nextStatus)}
                                    variant="contained"
                                    size='small'
                                    sx={{
                                        borderRadius: '999px',
                                        bgcolor: '#7C3AED',
                                        color: '#F9F8F6',
                                        px: 2.5,
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: '#6D28D9' }
                                    }}>
                                    {nextStatus}
                                </Button>
                                :
                                <Typography variant="caption" >
                                    더 이상 변경 가능한 상태가 없습니다.
                                </Typography>
                            }

                            {!['DONE', 'ARCHIVED'].includes(selectedProject.status) &&
                                <Button
                                    onClick={handleArchivedConfirmOpen}
                                    id="ARCHIVED"
                                    variant="contained"
                                    size='small'
                                    sx={{
                                        borderRadius: '999px',
                                        bgcolor: '#3B82F6',
                                        color: '#F9F8F6',
                                        px: 2.5,
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: '#2563EB' }
                                    }}>
                                    Archived
                                </Button>
                            }
                        </Stack>
                        <StatusTransitionConfirm
                            currentStatus={selectedProject.status}
                            nextStatus={nextStatus}
                            open={statusTransitionConfirmOpen}
                            handleClose={handleStatusTransitionClose}
                        />
                        {/* 참고로 workspace에서의 archived는 zustand action 로직 내부에서 
                            archiveProjectInWorkspace(action)를 호출한 project를 projectsInSelectedWorkspace에서 
                            제외했음. 개인공간에서의 archived는 projectDetail에서 archived하고 나면 kanban으로 
                            나와서 해당 값이 프론트의 filter를 통해 없어졌었는데. workspace에서는 그걸 구현하기 까다로워
                            그냥 projectsInSelectedWorkspace에서 제외하고 archivedProjectsInWorkspace에 넣었음
                            어차피 archived페이지에서는 archivedProjectInWorkspace를 참조할 것이라서 문제가 안될듯.
                        */}
                        <ArchivedConfirm
                            open={archivedConfirmOpen}
                            handleClose={handleArchivedConfirmClose}
                            currentStatus={selectedProject.status}
                        />
                    </Stack>


                </Paper>

            </Stack >
            {/* } */}


            {/* edit dialog */}
            < EditProjectDialog
                open={editProjectDialogOpen}
                handleClose={handleEditProjectClose}
            />
            {/* delete dialog */}
            < DeleteProjectDialog
                open={deleteProjectDialogOpen}
                handleClose={handleDeleteProjectDialogClose}
            />
            {/* overdue dialog */}
            <EditProjectAlertDialog
                open={overdueAlertOpen}
                handleClose={handleOverdueAlertClose}
            />
        </>
    )
}