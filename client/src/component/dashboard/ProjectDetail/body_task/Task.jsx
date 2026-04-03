import {
    Box, IconButton, LinearProgress,
    Stack, Typography, Tooltip,
    List,
} from "@mui/material";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import { useState } from "react";
import AddTask from "../dialogs/AddTask.jsx";
import { useEffect } from "react";
import { useProjectStore } from "../../../../store/useProjectStore.js";
import AlertDialog from "../dialogs/AlertDialog.jsx";
import { useTaskStore } from "../../../../store/useTaskStore.js";
import ConfirmDialog from "../dialogs/ConfirmDialog.jsx";

import TaskList from "./TaskList.jsx";

export default function Task() {
    const selectedProject = useProjectStore(state => state.selectedProject)
    const tasks = useTaskStore(state => state.tasks)
    const getTasks = useTaskStore(state => state.getTasks)
    const getProgress = useTaskStore(state => state.getProgress)

    const [open, setOpen] = useState(false); // addProject 용
    const [isAlertOpen, setIsAlertOpen] = useState(false); // 경고 Dialog 용
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 확인(done 취소?) Dialog 용
    const [pendingTaskId, setPendingTaskId] = useState(null); // 취소 대기 중인 Task ID

    const handleClickOpen = () => {
        if (['DONE'].includes(selectedProject.status) || selectedProject.archivedAt) {
            setIsAlertOpen(true);
            return
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAlertClose = () => {
        setIsAlertOpen(false);
    };

    useEffect(() => {
        getTasks(selectedProject._id)
    }, [getTasks, selectedProject._id])




    return (
        <Stack>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#064E3B' }}><b>Progress</b></Typography>
                <LinearProgress
                    variant="determinate"
                    value={getProgress()}
                    sx={{ height: 12, borderRadius: 5, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }}
                />
                <Typography variant="body2" textAlign="right" sx={{ mt: 1, color: 'text.secondary' }}>
                    {getProgress()}% Completed
                </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <b>Tasks</b>
                <Tooltip title='add task'>
                    <IconButton size="small" color="success" onClick={handleClickOpen} >
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Tooltip>
            </Typography >

            {/* 상황별 Dialog */}
            <AddTask open={open} handleClose={handleClose} />
            <AlertDialog isAlertOpen={isAlertOpen} handleAlertClose={handleAlertClose} />


            <Stack spacing={2}>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* {isEditting ?
                        <TaskItemEdit tasks={tasks} isEditting={isEditting} />
                        :
                        <TaskItem
                            tasks={tasks}
                            isEditting={isEditting}
                            setIsConfirmOpen={setIsConfirmOpen}
                            setPendingTaskId={setPendingTaskId}
                            setIsEditting={setIsEditting}
                        />
                    } */}
                    <TaskList
                        tasks={tasks}
                        setIsConfirmOpen={setIsConfirmOpen}
                        setPendingTaskId={setPendingTaskId}
                    />

                    {tasks.length === 0 ?
                        <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                            등록된 작업이 없습니다.
                        </Typography>

                        :
                        <></>
                    }
                    <ConfirmDialog pendingTaskId={pendingTaskId} setPendingTaskId={setPendingTaskId} isConfirmOpen={isConfirmOpen} setIsConfirmOpen={setIsConfirmOpen} />
                </List>

            </Stack>
        </Stack >
    )
}