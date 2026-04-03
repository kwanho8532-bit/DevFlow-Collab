import {
    IconButton, LinearProgress, Paper,
    Stack, Tooltip, Typography
} from "@mui/material";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import AddTaskDialog from "../../dialogs/AddTaskDialog.jsx";
import { useState } from "react";
import TaskItem from "../task/TaskItem.jsx";
import { useTaskStore } from "../../../../store/useTaskStore.js";
import { useProjectStore } from "../../../../store/useProjectStore.js";
import dayjs from "dayjs";
import OverdueOrStatusAlertDialog from "../../dialogs/OverdueOrStatusAlertDialog.jsx";


export default function ProjectTasks({ isDoneOrArchive }) {
    const tasksInWorkspaceProject = useTaskStore(state => state.tasksInWorkspaceProject)
    const getProgressInWorkspaceProject = useTaskStore(state => state.getProgressInWorkspaceProject)
    const selectedProject = useProjectStore(state => state.selectedProjectInWorkspace)

    const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false)
    const [overdueAlertOpen, setOverdueAlertOpen] = useState(false)

    const isOverdue = dayjs(selectedProject.deadline).isBefore(dayjs(), 'day')


    const handleOpen = () => {
        if (isOverdue || isDoneOrArchive) {
            return handleOverdueAlertOpen()
        }
        setAddTaskDialogOpen(true)
    }

    const handleClose = () => {
        setAddTaskDialogOpen(false)
    }

    const handleOverdueAlertOpen = () => {
        setOverdueAlertOpen(true)
    }

    const handleOverdueAlertClose = () => {
        setOverdueAlertOpen(false)
    }

    return (
        <Stack direction='column' spacing={2} sx={{ flex: 1 }}>
            <Stack direction='row' alignItems='center' spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                    Tasks
                    <Tooltip title='add task'>
                        <IconButton
                            onClick={handleOpen}
                            sx={{
                                color: '#4c1c94',
                                p: 0,
                                ml: 1
                            }}>
                            <AddCircleOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Tooltip title={`${getProgressInWorkspaceProject()}% Completed`}>
                    <LinearProgress
                        variant="determinate"
                        value={getProgressInWorkspaceProject()}
                        sx={{
                            flex: 1,
                            height: 12,
                            borderRadius: 5,
                            bgcolor: '#eee',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#10B981'
                            }
                        }}
                    />
                </Tooltip>
            </Stack>
            <Paper
                variant="outlined"
                sx={{
                    flex: 1,
                    minHeight: 0,
                    bgcolor: 'white',
                    borderRadius: 2,
                    whiteSpace: 'pre-line',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },

                }}>
                {tasksInWorkspaceProject.length === 0 ?
                    <Typography variant='subtitle1' textAlign='center' sx={{ fontWeight: 'bold' }}>
                        task를 추가해보세요!
                    </Typography>
                    :
                    tasksInWorkspaceProject.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            isOverdue={isOverdue}
                            isDoneOrArchive={isDoneOrArchive}
                            handleOpen={handleOverdueAlertOpen}
                        />))
                }
            </Paper>
            <AddTaskDialog
                open={addTaskDialogOpen}
                handleClose={handleClose}
            />
            <OverdueOrStatusAlertDialog
                open={overdueAlertOpen}
                handleClose={handleOverdueAlertClose}
            />
        </Stack>
    )
}