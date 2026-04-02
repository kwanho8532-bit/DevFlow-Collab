import { Box, Button, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import DeleteProjectDialog from "../dialogs/DeleteProjectDialog";

export default function ArchiveOverlay() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true)
    }

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false)
    }

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 999,
                bgColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(1px)',
                cursor: 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2
            }}
        >
            <Chip
                label="보관함에 Archive 되어 편집이 제한된 프로젝트입니다"

                sx={{ fontWeight: 'bold', boxShadow: 5, bgcolor: "#8B0000", color: '#eee' }}
            />

            <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/workspace/${id}/archive`)}
                sx={{
                    borderRadius: '999px',
                    px: 4,
                    py: 1.5,
                    bgcolor: '#3B82F6', // 기존에 쓰시던 테마 컬러
                    '&:hover': { bgcolor: '#2563EB' }
                }}
            >
                보관함으로 돌아가기
            </Button>

            <Button
                onClick={handleDeleteDialogOpen}
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

            <DeleteProjectDialog
                open={deleteDialogOpen}
                handleClose={handleDeleteDialogClose}
            />

        </Box>
    )
}