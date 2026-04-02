import {
    Box, Button, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, Typography, Portal
} from "@mui/material";
import { useProjectStore } from "../../../../store/useProjectStore";
import { useNavigate } from "react-router-dom";


export default function ArchivedDelete({ deleteDialogOpen, handleClose }) {
    const selectedProject = useProjectStore(state => state.selectedProject)
    const deleteProject = useProjectStore(state => state.deleteProject)

    const navigate = useNavigate()

    const handleDelete = async (projectId) => {
        try {
            await deleteProject(projectId)
            handleClose()
            navigate('/hub', {
                replace: true,
                state: { reason: 'ARCHIVED_PROJECT_DELETE', }
            })
        } catch (err) {
            console.error("삭제 중 오류가 발생했습니다:", err);
        }
    }

    return (
        <Portal>
            <Dialog
                disableRestoreFocus
                open={deleteDialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '32px',
                            padding: '16px',
                            backgroundImage: 'none',
                        }
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" component='div'>
                    <Typography variant="h6" sx={{ pt: 2, fontWeight: 800, color: '#111827' }} textAlign='center'>
                        프로젝트 삭제
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{
                        bgcolor: '#FEF2F2', // 아주 연한 빨간색 배경
                        borderRadius: '16px',
                        p: 2,
                        mb: 2,
                        border: '1px dashed #FCA5A5'
                    }}>
                        <Typography variant="subtitle1" textAlign='center' sx={{ color: '#991B1B', fontWeight: 700 }}>
                            "{selectedProject.projectName} - {selectedProject.status}"
                        </Typography>
                    </Box>
                    <DialogContentText component='div' id="alert-dialog-description" textAlign='center'>
                        <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.6 }}>
                            이 프로젝트를 삭제하시겠습니까? <br />
                            삭제된 데이터는 <strong>영구적으로 제거</strong>되며 복구할 수 없습니다.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            borderRadius: '999px',
                            px: 3,
                            color: '#6B7280',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={() => handleDelete(selectedProject._id)}// 실제 삭제 함수 연결
                        variant="contained"
                        sx={{
                            borderRadius: '999px',
                            px: 4,
                            bgcolor: '#DC2626', // 삭제 강조 빨간색
                            fontWeight: 700,
                            '&:hover': { bgcolor: '#B91C1C' },
                            boxShadow: 'none'
                        }}
                    >
                        삭제하기
                    </Button>
                </DialogActions>
            </Dialog>
        </Portal >
    )
}