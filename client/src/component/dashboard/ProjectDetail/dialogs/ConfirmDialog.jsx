import {
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

import { useTaskStore } from "../../../../store/useTaskStore.js";


export default function ConfirmDialog({ pendingTaskId, setPendingTaskId, isConfirmOpen, setIsConfirmOpen }) {
    const toggleTask = useTaskStore(state => state.toggleTask)

    const handleConfirmCancel = () => {
        if (pendingTaskId) {
            toggleTask(pendingTaskId)
        }
        setIsConfirmOpen(false);
        setPendingTaskId(null);
    }
    return (
        <Dialog
            disableRestoreFocus
            open={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '32px',
                        padding: '16px',
                        backgroundImage: 'none',
                        minWidth: '300px'
                    }
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', color: '#374151' }}>
                Task 완료 취소
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: '#4B5563' }}>
                    이 할 일을 다시 <b>미완료 상태</b>로 되돌리시겠습니까?
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={() => setIsConfirmOpen(false)}
                    sx={{
                        color: '#9CA3AF',
                        '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                    }}
                >
                    아니오
                </Button>
                <Button
                    onClick={handleConfirmCancel}
                    variant="contained"
                    disableElevation
                    sx={{
                        bgcolor: '#10B981',
                        '&:hover': { bgcolor: '#059669' },
                        borderRadius: '8px'
                    }}
                >
                    네, 취소합니다
                </Button>
            </DialogActions>
        </Dialog>
    )
}