import {
    Box, Checkbox, IconButton,
    ListItem, ListItemButton, ListItemIcon,
    ListItemText, Paper, Stack,
    Tooltip, Avatar
} from "@mui/material";
import { cloneElement, useState } from "react";
import { importanceRGBA, getImportanceOptions } from "../../../etc/importanceOptions";
import { useTaskStore } from "../../../../store/useTaskStore.js";
import EditIcon from '@mui/icons-material/Edit';
import TaskEditItem from "./TaskItemEdit";
import { useProjectStore } from "../../../../store/useProjectStore.js";

export default function TaskItem({ task, isOverdue, isDoneOrArchive, handleOpen }) {
    const toggleTaskInWorkspaceProject = useTaskStore(state => state.toggleTaskInWorkspaceProject)
    const [isEditing, setIsEditing] = useState(false)
    const importance = getImportanceOptions(task.userImportance)

    const isDone = task.done


    const toggle = async (taskId) => {
        if (isOverdue || isDoneOrArchive) {
            return handleOpen()
        }
        await toggleTaskInWorkspaceProject(taskId)
    }

    const handleEditToggle = () => {
        if (isOverdue || isDoneOrArchive) {
            return handleOpen()
        }
        setIsEditing(state => !state)
    }


    return (
        <>
            {isEditing ?
                <TaskEditItem task={task} handleEditToggle={handleEditToggle} />
                :
                <ListItem
                    key={task._id}
                    disablePadding
                    secondaryAction={
                        <Stack direction='row' spacing={1}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.7,
                                px: 1,
                                py: 0.4,
                                borderRadius: '6px',
                                fontSize: '8px',
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
                                    <IconButton size="small" disabled={isDone} onClick={handleEditToggle} sx={{ color: `${importance.color}`, p: 0 }}  >
                                        <EditIcon sx={{ fontSize: '20px' }} />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>
                    }
                >
                    <Paper
                        variant="outlined"
                        sx={{
                            width: '100%',
                            transition: 'all 0.2s ease',
                            bgcolor: task.done ? 'rgba(0,0,0,0.02)' : '#fff',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                bgcolor: importanceRGBA[task.userImportance],
                            }
                        }}
                    >
                        <ListItemButton
                            sx={{ p: 1 }}
                            onClick={() => toggle(task._id)}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Checkbox
                                    edge="start"
                                    checked={isDone}
                                    tabIndex={-1}
                                    disableRipple
                                    color='success'
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {/* 태스크 이름 */}
                                        <span>{task.taskName}</span>

                                        {/* 유저 profileImg (작은 avatar) */}
                                        <Tooltip title={task.user.username}>
                                            <Avatar
                                                alt={task.user.username}
                                                src={task.user.profileImg}
                                                sx={{ width: 20, height: 20, }}
                                            />
                                        </Tooltip>
                                    </Box>
                                }

                                slotProps={{
                                    primary: {
                                        sx: {
                                            textDecoration: isDone ? 'line-through' : 'none',
                                            color: isDone ? '#aaa' : '#333',
                                            fontWeight: isDone ? 400 : 500,
                                            fontSize: '12px', // 👈 이제 확실히 먹힙니다!
                                            transition: '0.2s'
                                        }
                                    }
                                }}
                            />

                        </ListItemButton>
                    </Paper>
                </ListItem >
            }
        </>
    )
}