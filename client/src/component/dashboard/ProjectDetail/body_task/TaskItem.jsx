import {
    Box, Checkbox, IconButton, ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack, Tooltip
} from "@mui/material"

import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';

import { cloneElement, useState } from "react"
import { getImportanceOptions } from "../../../etc/importanceOptions"
import { useTaskStore } from "../../../../store/useTaskStore"
import TaskItemEdit from "./TaskItemEdit";
import { useProjectStore } from "../../../../store/useProjectStore";
import dayjs from "dayjs";
import TaskEditAlert from "../dialogs/TaskEditAlert.";

export default function TaskItem({ task, setIsConfirmOpen, setPendingTaskId }) {
    const selectedProject = useProjectStore(state => state.selectedProject)
    const [isEditting, setIsEditting] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false);

    const toggleTask = useTaskStore(state => state.toggleTask)

    const handleAlertOpen = () => {
        setAlertOpen(true);
    };

    const handleAlertClose = () => {
        setAlertOpen(false);
    };


    const importance = getImportanceOptions(task.userImportance)
    const isDone = task.done

    const handleTaskDone = (task) => {
        if (selectedProject.status === 'DONE') {
            return handleAlertOpen()

        }
        if (task.done) {
            setPendingTaskId(task._id);
            setIsConfirmOpen(true)
        } else {
            toggleTask(task._id)
        }
    }

    const toggleIsEditting = () => {
        if (selectedProject.status === 'DONE') {
            return handleAlertOpen()
        }
        setIsEditting(prev => !prev)
    }

    return (
        <Box>
            {isEditting ?
                <TaskItemEdit task={task} toggleIsEditting={toggleIsEditting} />
                :
                <ListItem
                    key={task._id}
                    disablePadding
                    // 리스트 아이템 내부의 우측 Chip 버튼 등을 위해 secondaryAction 사용 가능
                    secondaryAction={
                        <Stack direction='row' spacing={1}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.7,
                                px: 1,
                                py: 0.4,
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                // 완료되면 회색, 아니면 중요도별 고유 색상
                                bgcolor: isDone ? '#F3F4F6' : `${importance.color}15`,
                                color: isDone ? '#9CA3AF' : importance.color,
                                border: isDone ? '1px solid #E5E7EB' : `1px solid ${importance.color}30`,
                                transition: 'all 0.2s ease',
                                // 글자 대문자 변환 및 간격 조절
                                letterSpacing: '0.02em',
                            }}>
                                {cloneElement(importance.icon, {
                                    sx: { fontSize: '14px', color: 'inherit' }
                                })}
                                <span>{importance.label}</span>
                            </Box>
                            {/* 하나가 edit 중이면 다른 건 disabled 되도록 만들기 */}
                            <Tooltip title='edit task'>
                                <span>
                                    <IconButton size="small" disabled={isDone} onClick={toggleIsEditting} sx={{ color: `${importance.color}` }}  >
                                        <EditIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>
                    }
                    sx={{ mb: 2 }}
                >
                    <Paper
                        variant="outlined"
                        sx={{
                            width: '100%',
                            borderRadius: '15px',
                            borderColor: task.done ? '#eee' : importance.color,
                            transition: 'all 0.2s ease',
                            bgcolor: task.done ? 'rgba(0,0,0,0.02)' : '#fff',
                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                        }}
                    >
                        <ListItemButton
                            onClick={() => handleTaskDone(task)}
                            sx={{ borderRadius: '15px', p: 1.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Checkbox
                                    edge="start"
                                    checked={task.done}
                                    tabIndex={-1}
                                    disableRipple
                                    color="success"
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={task.taskName}
                                sx={{
                                    textDecoration: task.done ? 'line-through' : 'none',
                                    color: task.done ? '#aaa' : '#333',
                                    fontWeight: task.done ? 400 : 500,
                                    transition: '0.2s'
                                }}
                            />
                        </ListItemButton>
                        <TaskEditAlert
                            alertOpen={alertOpen}
                            handleAlertClose={handleAlertClose}
                        />
                    </Paper>
                </ListItem>
            }
        </Box>
    )
}