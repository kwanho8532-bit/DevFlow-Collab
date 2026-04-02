import { Box, Button, Chip } from "@mui/material";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProjectDeleteDialog from "../dialogs/ProjectDeleteDialog";
import { useProjectStore } from "../../../../store/useProjectStore";

export default function DeadlineOverlay() {
    const navigate = useNavigate()

    const selectedProject = useProjectStore(state => state.selectedProject)
    const archiveProject = useProjectStore(state => state.archiveProject)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const handleDeleteDailogOpen = () => {
        setDeleteDialogOpen(true)
    }

    const handleDeleteDailogClose = () => {
        setDeleteDialogOpen(false)
    }

    const handleArchive = async () => {
        if (!selectedProject.archivedAt) {
            await archiveProject(selectedProject._id)
        }
        return
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 999, // 모든 요소보다 위에 배치
                bgcolor: 'rgba(255, 255, 255, 0.3)', // 아주 살짝 흐리게
                backdropFilter: 'blur(1px)', // 편집 불가능한 느낌의 블러 처리
                cursor: 'not-allowed', // 마우스 커서를 '금지' 모양으로
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* 사용자에게 이유를 알려주는 플로팅 메시지 */}
            <Chip
                label="기한이 만료되어 편집이 제한된 프로젝트입니다"

                sx={{ fontWeight: 'bold', boxShadow: 5, bgcolor: "#8B0000", color: '#eee' }}
            />
            <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{
                    borderRadius: '999px',
                    px: 4,
                    py: 1.5,
                    bgcolor: '#064E3B', // 기존에 쓰시던 테마 컬러
                    '&:hover': { bgcolor: '#053f30' }
                }}
            >
                프로젝트 보드로 돌아가기
            </Button>
            <Button
                onClick={handleArchive}
                variant='contained'
                startIcon={<ArchiveIcon />}
                sx={{
                    borderRadius: '999px',
                    px: 4,
                    py: 1.5,
                    bgcolor: '#3B82F6',
                    '&:hover': { bgcolor: '#2563EB' }
                }}
            >
                {/* 누르면 toast 나오고, 버튼 내용이 바뀌게 만들기 */}
                아카이브에 보관하기
            </Button>
            <Button
                onClick={handleDeleteDailogOpen}
                variant='contained'
                startIcon={<DeleteIcon />}
                sx={{
                    borderRadius: '999px',
                    px: 4,
                    py: 1.5,
                    bgcolor: '#E91C1C',
                    '&:hover': { bgcolor: '#C91B1B' }
                }}
            >
                프로젝트 삭제
            </Button>
            <ProjectDeleteDialog open={deleteDialogOpen} handleClose={handleDeleteDailogClose} />
        </Box>
    )
}