import {
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useProjectStore } from "../../../store/useProjectStore.js";

export default function EditProjectAlertDialog({ open, handleClose }) {
    const selectedProject = useProjectStore(state => state.selectedProjectInWorkspace)

    return (
        <Dialog
            disableRestoreFocus
            open={open}
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
            <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorOutlineIcon color="error" />
                {"작업 제한 안내"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ color: '#333', fontWeight: 500 }}>
                    현재 프로젝트가 <b>{selectedProject.status}</b> 상태입니다. <br />
                    완료(DONE) 또는 보관(ARCHIVED)된 프로젝트에서는 수정할 수 없습니다.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="contained"
                    disableElevation
                    sx={{
                        bgcolor: '#4c1c94',
                        '&:hover': { bgcolor: '#3a1572' },
                        borderRadius: '8px'
                    }}

                >
                    확인
                </Button>
            </DialogActions>
        </Dialog >
    )
}