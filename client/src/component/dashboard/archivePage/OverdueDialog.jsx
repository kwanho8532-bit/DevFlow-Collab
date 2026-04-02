import {
    Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Button
} from '@mui/material';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function OverdueDialog({ overdueDialogOpen, handleOverdueClose }) {
    return (
        <Dialog
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
            open={overdueDialogOpen}
            onClose={handleOverdueClose}
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
            <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorOutlineIcon color="error" />
                {"복구 작업 제한 안내"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ color: '#333', fontWeight: 500 }}>
                    해당 프로젝트는 마감 기한이 지난 상태입니다. <br />
                    마감 기한이 지난 프로젝트는 보관함에서 꺼낼 수 없습니다.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleOverdueClose}
                    variant="contained"
                    disableElevation
                    sx={{
                        bgcolor: '#10B981',
                        '&:hover': { bgcolor: '#059669' },
                        borderRadius: '8px'
                    }}

                >
                    확인
                </Button>
            </DialogActions>
        </Dialog >
    )
}