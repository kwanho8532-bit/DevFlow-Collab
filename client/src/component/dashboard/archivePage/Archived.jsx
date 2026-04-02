import {
    Box, Chip, IconButton,
    Paper, Tooltip, Typography
} from "@mui/material";

import { DataGrid } from '@mui/x-data-grid';


import VisibilityIcon from '@mui/icons-material/Visibility';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import { useEffect, useState } from "react";
import { useProjectStore } from "../../../store/useProjectStore";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import OverdueDialog from "./OverdueDialog";


export default function Archvied() {
    const archivedProjects = useProjectStore(state => state.archivedProjects)
    const getArchivedProjects = useProjectStore(state => state.getArchivedProjects)
    const unarchiveProject = useProjectStore(state => state.unarchiveProject)

    const [project, setProject] = useState(null)
    const [overdueDialogOpen, setOverdueDialogOpen] = useState(false)

    const handleOverdueOpen = () => {
        setOverdueDialogOpen(true)
    }

    const handleOverdueClose = () => {
        setOverdueDialogOpen(false)
    }

    const handleUnarchive = async (project) => {
        const isOverdue = dayjs(project.deadline).isBefore(dayjs(), 'day')
        if (isOverdue) {
            handleOverdueOpen()
        } else {
            await unarchiveProject(project._id)
        }
    }

    useEffect(() => {
        const func = () => {
            getArchivedProjects()
        }
        func()
    }, [getArchivedProjects])

    const statusColor = {
        PLANNING: { bgcolor: '#EDE9FE', color: '#6D28D9' },
        IN_PROGRESS: { bgcolor: '#DBEAFE', color: '#1E40AF' },
        DONE: { bgcolor: '#DCFCE7', color: '#15803D' },
        ARCHIVED: { bgcolor: '#F1F5F9', color: '#475569' },
    }

    const columns = [
        {
            field: 'projectName',
            headerName: '프로젝트 명',
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'deadline',
            headerName: '마감일',
            width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'status',
            headerName: '상태',
            width: 150,
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
                        }} />
                )
            }
        },
        {
            field: 'actions', // 데이터에는 없지만 식별을 위해 임의로 지정, headerName: '상태', width: '150px' },
            headerName: '액션',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            sortable: false,   // 버튼 컬럼은 정렬할 필요가 없으므로 false
            filterable: false, // 필터 기능도 제외
            // 💡 핵심: renderCell을 사용해 원하는 컴포넌트를 직접 리턴
            renderCell: (params) => {
                // params.row를 통해 해당 줄의 데이터(id 등)에 접근 가능
                const project = params.row

                return (
                    <Box>
                        <Tooltip title='보기' placement="top">
                            <IconButton component={Link} to={`/project/${project._id}`}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='복구' placement="top">
                            <IconButton color="primary" onClick={() => handleUnarchive(project)}>
                                <UnarchiveIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )
            }
        }
    ]

    const rows = archivedProjects.map(ap => ({
        id: ap._id,          // 💡 DataGrid는 기본적으로 'id'라는 필드를 찾습니다.
        projectName: ap.projectName,
        deadline: dayjs(ap.deadline).format('YYYY.MM.DD'),
        status: ap.status,
        _id: ap._id          // 💡 renderCell에서 사용하기 위해 _id도 남겨두세요.
    }));

    return (
        <Box
            sx={{
                width: '100%',
                height: 'calc(100vh - 48px)',
                bgcolor: '#F9F8F6', // 메인 화이트 계열
                borderRadius: '24px', // 모든 모서리를 둥글게 하거나 상황에 맞춰 조절
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)', // 떠 있는 느낌을 위한 그림자
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'

            }}
        >
            <Typography variant="h4" textAlign='center' fontWeight={700} sx={{ mb: 3 }}>
                Project Archive
            </Typography>



            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row._id}
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                        overflow: 'auto',
                        scrollbarWidth: 'thin'
                    }}
                />
            </Paper>

            <OverdueDialog
                overdueDialogOpen={overdueDialogOpen}
                handleOverdueClose={handleOverdueClose}
            />


        </Box>
    )
}