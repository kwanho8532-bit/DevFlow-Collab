import {
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useProjectStore } from "../../../../store/useProjectStore.js";

export default function TaskEditAlert({ alertOpen, handleAlertClose }) {
    const selectedProject = useProjectStore(state => state.selectedProject)

    const status = !selectedProject.archivedAt ? selectedProject.status : 'ARCHIVED'

    return (
        <Dialog
            disableRestoreFocus
            open={alertOpen}
            onClose={handleAlertClose}
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
                    현재 프로젝트가 <b>{status}</b> 상태입니다. <br />
                    완료(DONE) 또는 보관(ARCHIVED)된 프로젝트에서는 Task를 편집할 수 없습니다.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleAlertClose}
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
            </DialogActions>
        </Dialog>
    )
}