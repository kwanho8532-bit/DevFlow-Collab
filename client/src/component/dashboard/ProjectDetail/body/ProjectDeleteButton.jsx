import { Button } from "@mui/material";
import { useState } from "react";
import ProjectDeleteDialog from "../dialogs/ProjectDeleteDialog.jsx";


export default function ProjectDeleteButton() {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleConfirmOpen = () => {
        setConfirmOpen(true)
    }

    const handleConfirmClose = () => {
        setConfirmOpen(false)
    }

    return (
        <>
            <Button
                onClick={handleConfirmOpen}
                fullWidth
                variant="contained"
                sx={{
                    bgcolor: '#E91C1C',
                    borderRadius: '12px',
                    py: 1,
                    '&:hover': { bgcolor: '#C91B1B' },

                }}>
                Delete Project
            </Button>
            <ProjectDeleteDialog open={confirmOpen} handleClose={handleConfirmClose} />
        </>
    )
}