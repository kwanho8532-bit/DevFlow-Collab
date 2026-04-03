import {
    Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Button,
    Typography, Stack
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // 화살표 아이콘 추가 시

import { useProjectStore } from '../../../../store/useProjectStore.js';

export default function StatusTransitionDialog({ id, currentStatus, nextStatus, open, handleClose }) {
    const patchProject = useProjectStore(state => state.patchProject)

    const statusTransitionRequest = async (nextStatus) => {
        try {
            patchProject(nextStatus)
        } catch (err) {
            console.log(err.response)
        } finally {
            handleClose()
        }
    }

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={handleClose}
            aria-labelledby="status-dialog-title"
            aria-describedby="status-dialog-description"
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '32px',
                        padding: '16px',
                        backgroundImage: 'none',
                    },
                },
            }}
        >
            {/* 제목 부분: 상태 변화를 시각적으로 표현 */}
            <DialogTitle id="status-dialog-title" component="div" sx={{ textAlign: 'center', pt: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {currentStatus}
                    </Typography>
                    <ArrowForwardIcon sx={{ color: '#064E3B', fontSize: '1.2rem' }} />
                    <Typography variant="h6" sx={{ color: '#064E3B', fontWeight: 800 }}>
                        {nextStatus}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', py: 1 }}>
                <DialogContentText id="status-dialog-description" component="div">
                    <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                        프로젝트 상태를 변경하시겠습니까?
                    </Typography>
                    <Typography variant="caption" color="success">
                        <strong>{currentStatus}</strong>에서 <strong>{nextStatus}</strong>로 상태가 업데이트됩니다.
                    </Typography>
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 2, pt: 1, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        borderRadius: '999px',
                        px: 4,
                        color: 'text.secondary',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                    }}
                >
                    No
                </Button>
                <Button
                    onClick={() => statusTransitionRequest(nextStatus)}
                    autoFocus
                    variant="contained"
                    sx={{
                        borderRadius: '999px',
                        px: 4,
                        bgcolor: '#064E3B',
                        color: '#fff',
                        fontWeight: 700,
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#053f30',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }
                    }}
                >
                    Yes, Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}