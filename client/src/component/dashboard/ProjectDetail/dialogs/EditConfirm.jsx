import {
    Box,
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    Stack,
    Typography
} from "@mui/material";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImportanceOptions } from "../../../etc/importanceOptions";

export default function EditConfirm({ editConfirmOpen, handleEditConfirmClose, prevObj, changeObj, formId }) {
    const { changeTaskName, changeUserImportance } = changeObj

    const { prevTaskName, prevUserImportance } = prevObj

    const changeImportanceColor = getImportanceOptions(changeUserImportance).color
    const prevImportanceColor = getImportanceOptions(prevUserImportance).color

    return (
        <Dialog
            disableRestoreFocus
            open={editConfirmOpen}
            onClose={handleEditConfirmClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
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
            <DialogTitle id="alert-dialog-title" sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Stack direction='row' spacing={1.5} justifyContent='center' alignItems='center'>
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            {prevTaskName} (<span style={{ color: prevImportanceColor }}>{prevUserImportance.slice(0, 1)}</span>)
                        </Typography>
                        <ArrowForwardIcon sx={{ color: '#064E3B', fontSize: '1.2rem' }} />
                        <Typography variant="h6" sx={{ color: '#064E3B', fontWeight: 800 }}>
                            {changeTaskName} (<span style={{ color: changeImportanceColor }}>{changeUserImportance.slice(0, 1)}</span>)
                        </Typography>
                    </Stack>

                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="status-dialog-description" component="div">
                    <Typography variant="body1" color="text.primary" sx={{ mb: 1 }}>
                        태스크 내용을 변경하시겠습니까?
                    </Typography>
                    <Typography variant="caption" color='success'>
                        <strong>{prevTaskName}</strong>에서 <strong>{changeTaskName}</strong>으로 내용이 변경됩니다.
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleEditConfirmClose}
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
                    type="submit"
                    form={formId}
                    onClick={handleEditConfirmClose}
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
                    Yes, Edit
                </Button>
            </DialogActions>
        </Dialog>
    )
}