import { Button } from "@mui/material";
import { useState } from "react";
import ProjectEditDialog from "../dialogs/ProjectEditDialog";
import { useProjectStore } from "../../../../store/useProjectStore";
import EditAlertOpen from "../dialogs/EditAlertDialog";


export default function ProjectEditButton() {
    const selectedProject = useProjectStore(state => state.selectedProject)

    const [open, setOpen] = useState(false);
    const [editAlertOpen, setEditAlertOpen] = useState(false);

    const handleClickOpen = () => {
        if (selectedProject.archivedAt || selectedProject.status === 'DONE') {
            setEditAlertOpen(true)
        } else {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAlertClose = () => {
        setEditAlertOpen(false)
    }

    const status = selectedProject.archivedAt ? 'ARCHIVED' : selectedProject.status

    return (
        <>
            <Button
                onClick={handleClickOpen}
                fullWidth
                variant="contained"
                sx={{
                    bgcolor: '#064E3B',
                    borderRadius: '12px',
                    py: 1,
                    '&:hover': { bgcolor: '#053e2f' },

                }}>
                Edit Project
            </Button>
            <ProjectEditDialog
                open={open}
                handleClose={handleClose}
                key={selectedProject?._id}
            />
            <EditAlertOpen
                status={status}
                editAlertOpen={editAlertOpen}
                handleAlertClose={handleAlertClose}
            />
        </>
    )
}