import {
    Avatar, Button, Divider,
    Paper, Stack, Typography
} from "@mui/material";

import StatusTransitionDialog from "../dialogs/StatusTransitionDialog.jsx";
import { useAuthStore } from "../../../../store/useAuthStore.js";
import { useState } from "react";
import { shallow } from "zustand/shallow";
import { useProjectStore } from "../../../../store/useProjectStore.js";


export default function Body({ nextStatus, id, currentStatus }) {
    const [targetStatus, setTargetStatus] = useState(null)
    const [open, setOpen] = useState(false);

    const selectedProject = useProjectStore(state => state.selectedProject)
    const auth = useAuthStore(state => state.auth, shallow)

    const handleClickOpen = (e) => {
        setTargetStatus(e.target.id)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Stack>
            <Paper sx={{ p: 3, borderRadius: '25px', bgcolor: '#F9FAFB', border: '1px solid #eee' }} elevation={0}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Project Info</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {selectedProject?.description}
                </Typography>


                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Owner</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar alt={selectedProject.owner.username} src={selectedProject.owner.profileImg} />
                    <Typography variant="body2">{selectedProject.owner.username}</Typography>
                </Stack>

                {(auth._id === selectedProject.owner._id)
                    &&
                    <>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Status Transition</Typography>
                        <Stack direction='row' spacing={1} >
                            {nextStatus ?
                                <Button
                                    id={nextStatus}
                                    onClick={handleClickOpen}
                                    variant="contained"
                                    size='small'
                                    sx={{
                                        bgcolor: '#10B981',
                                        borderRadius: '12px',
                                        py: 0.5,
                                        '&:hover': { bgcolor: '#059669' },
                                    }}>
                                    {nextStatus}
                                </Button>
                                :
                                <Typography variant="caption" >
                                    더 이상 변경 가능한 상태가 없습니다.
                                </Typography>
                            }

                            {!['DONE', 'ARCHIVED'].includes(selectedProject.status) &&
                                <Button
                                    id="ARCHIVED"
                                    onClick={handleClickOpen}
                                    variant="contained"
                                    size='small'
                                    sx={{
                                        bgcolor: '#8B5CF6',
                                        borderRadius: '12px',
                                        py: 0.5,
                                        '&:hover': { bgcolor: '#7C3AED' },
                                    }}>
                                    Archived
                                </Button>
                            }
                        </Stack>
                        <StatusTransitionDialog
                            id={id}
                            currentStatus={currentStatus}
                            nextStatus={targetStatus}
                            open={open}
                            handleClose={handleClose}
                        />


                    </>
                }


            </Paper>
        </Stack>
    )
}