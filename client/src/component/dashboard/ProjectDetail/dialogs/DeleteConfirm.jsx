import {
    Box, Button, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, Typography
} from "@mui/material";

import { useTaskStore } from "../../../../store/useTaskStore.js";


export default function DeleteConfirm({ task, deleteConfirmOpen, handleDeleteConfirmClose }) {
    const deleteTask = useTaskStore(state => state.deleteTask)

    const handleDelete = (taskId) => {
        deleteTask(taskId)
        handleDeleteConfirmClose()
    }

    return (
        <Dialog
            disableRestoreFocus
            open={deleteConfirmOpen}
            onClose={handleDeleteConfirmClose}
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
                    태스크 삭제
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
                        "{task.taskName} - {task.userImportance}"
                    </Typography>
                </Box>
                <DialogContentText component='div' id="alert-dialog-description" textAlign='center'>
                    <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.6 }}>
                        이 태스크를 삭제하시겠습니까? <br />
                        삭제된 데이터는 <strong>영구적으로 제거</strong>되며 복구할 수 없습니다.
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
                <Button
                    onClick={handleDeleteConfirmClose}
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
                    onClick={() => handleDelete(task._id)}// 실제 삭제 함수 연결
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
    )
}