import { Alert, Box, Chip, IconButton, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useProjectStore } from "../../../../store/useProjectStore";


import VisibilityIcon from '@mui/icons-material/Visibility';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import OverdueConfirm from "../../dialogs/OverdueConfirm";

export default function WorkspaceArchive() {
    const { id } = useParams()
    const navigate = useNavigate()

    const archivedProjects = useProjectStore(state => state.archivedProjectsInWorkspace)
    const getArchivedProjectsInWorkspace = useProjectStore(state => state.getArchivedProjectsInWorkspace)
    const setSelectedProjectInWorkspace = useProjectStore(state => state.setSelectedProjectInWorkspace)
    const unarchiveProjectInWorkspace = useProjectStore(state => state.unarchiveProjectInWorkspace)

    const [overdueDialogOpen, setOverdueDialogOpen] = useState(false)

    useEffect(() => {
        const func = async () => {
            await getArchivedProjectsInWorkspace(id)
        }
        func()
    }, [])

    const handleOverdueDialogOpen = () => {
        setOverdueDialogOpen(true)
    }

    const handleOverdueDialogClose = () => {
        setOverdueDialogOpen(false)
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false)
    }


    const statusColor = {
        PLANNING: { bgcolor: '#EDE9FE', color: '#6D28D9' },
        IN_PROGRESS: { bgcolor: '#DBEAFE', color: '#1E40AF' },
        DONE: { bgcolor: '#DCFCE7', color: '#15803D' },
        ARCHIVED: { bgcolor: '#F1F5F9', color: '#475569' },
    }

    const handleVisible = async (projectId) => {
        try {
            const filtered = archivedProjects.filter(project => project._id === projectId)

            await setSelectedProjectInWorkspace(...filtered)
            navigate(`/workspace/${id}`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUnarchive = async (project) => {
        try {
            const isOverdue = dayjs(project.deadline).isBefore(dayjs(), 'day')
            if (isOverdue) return handleOverdueDialogOpen()
            await unarchiveProjectInWorkspace(project.id)
        } catch (err) {
            console.log(err)
        }
    }

    const columns = [
        {
            field: 'projectName',
            headerName: '프로젝트 명',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'deadline',
            headerName: '마감일',
            width: '120',
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'archivedAt',
            headerName: '보관일',
            width: '120',
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'status',
            headerName: '상태',
            width: '150',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const projectStatus = params.row.status

                return (
                    <Chip
                        label={projectStatus}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            bgcolor: statusColor[projectStatus].bgcolor,
                            color: statusColor[projectStatus].color
                        }}
                    />
                )
            }
        },
        {
            field: 'actions',
            headerName: '액션',
            width: '150',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const project = params.row

                // 보기 버튼 누르면 selectedProjectInWorkspace를 해당 project로 설정해서 board를 띄우고 
                // archivedAt을 통해 분기해서 overlay를 씌우고 overlay위에 삭제버튼, archive로 돌아가기 버튼 등 제작
                return (
                    <Stack direction='row' justifyContent='center'>
                        <Tooltip title='보기' placement='top'>
                            <IconButton onClick={() => handleVisible(project.id)}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='복구' placement='top'>
                            <IconButton color="primary" onClick={() => handleUnarchive(project)}>
                                <UnarchiveIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                )

            }
        }
    ]

    const rows = archivedProjects.map(project => ({
        id: project._id,
        projectName: project.projectName,
        deadline: dayjs(project.deadline).format('YYYY.MM.DD'),
        archivedAt: dayjs(project.archivedAt).format('YYYY.MM.DD'),
        status: project.status,
    }))

    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            bgcolor: '#F9F8F6', // 메인 화이트 계열
            borderRadius: '24px', // 모든 모서리를 둥글게 하거나 상황에 맞춰 조절
            boxShadow: '0px 4px 20px rgba(0,0,0,0.15)', // 떠 있는 느낌을 위한 그림자
            p: 3,
        }}>
            <Typography variant="h4" textAlign='center' fontWeight={700} sx={{ mb: 3 }}>
                Project Archive
            </Typography>

            <DataGrid
                columns={columns}
                rows={rows}
                hideFooterPagination
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                sx={{
                    overflow: 'auto',
                    scrollbarWidth: 'thin'
                }}
            />

            <OverdueConfirm
                open={overdueDialogOpen}
                handleClose={handleOverdueDialogClose}
            />


        </Box >
    )
}