import {
    IconButton, Paper, Stack,
    Tooltip, TextField, Box,
    FormControl, InputLabel, Select,
    MenuItem, Typography,
} from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import CircleIcon from '@mui/icons-material/Circle';
import EditOffIcon from '@mui/icons-material/EditOff';
import SendIcon from '@mui/icons-material/Send';

import { Controller, useForm } from "react-hook-form";
import { importanceOptions } from "../../../etc/importanceOptions.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTaskSchema } from "../../../../schema/zod.js";
import { useTaskStore } from "../../../../store/useTaskStore.js";
import EditConfirm from "../dialogs/EditConfirm.jsx";
import { useState } from "react";
import DeleteConfirm from "../dialogs/DeleteConfirm.jsx";

export default function TaskItemEdit({ task, toggleIsEditting }) {
    const editTask = useTaskStore(state => state.editTask)
    const [editConfirmOpen, setEditConfirmOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isDirty },
        watch
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        resolver: zodResolver(addTaskSchema),
        defaultValues: {
            taskName: task.taskName,
            userImportance: task.userImportance
        }
    })

    const changeTaskName = watch('taskName')
    const changeUserImportance = watch('userImportance')

    const changeObj = {
        changeTaskName,
        changeUserImportance
    }

    const prevObj = {
        prevTaskName: task.taskName,
        prevUserImportance: task.userImportance
    }

    const handleEdit = (formData) => {
        const taskId = task._id
        editTask(formData, taskId)
        toggleIsEditting()
    }


    const handleEditConfirmOpen = () => {
        setEditConfirmOpen(true);
    };

    const handleEditConfirmClose = () => {
        setEditConfirmOpen(false);
    };

    const handleDeleteConfirmOpen = () => {
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };


    return (
        <Box
            onSubmit={handleSubmit(handleEdit)}
            component="form"
            id={`edit-task-form-${task._id}`}
            sx={{
                '& > :not(style)': { m: 1, },
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}
            noValidate
            autoComplete="off"
        >
            <Paper
                key={task._id}
                variant="outlined"
                sx={{
                    width: '100%',
                    borderRadius: '15px',
                    borderColor: '#eee',
                    transition: 'all 0.2s ease',
                    bgcolor: 'fff',
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }}
            >
                {/* task edit 로직 마무리(delete, editSubmit etc) */}
                <Stack direction='row' spacing={2} sx={{ p: 2 }} >
                    <TextField
                        {...register('taskName')}
                        defaultValue={task?.taskName}
                        id={task.taskName}
                        label="Task Name"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '&.Mui-focused fieldset': {
                                    borderColor: '#064E3B',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#064E3B',
                            },
                            flex: 1,
                            m: 0
                        }}
                    />

                    <Controller
                        name="userImportance"
                        control={control}
                        defaultValue={task.userImportance}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                error={!!errors.userImportance}
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#064E3B',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#064E3B',
                                    },
                                }}>
                                <InputLabel id="importance-select-label">Importance</InputLabel>
                                <Select
                                    {...field}
                                    labelId="importance-select-label"
                                    label="Importance"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    {importanceOptions.map((option) => (
                                        <MenuItem key={option.label} value={option.label}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {/* 색상 점 아이콘으로 시각화 */}
                                                <CircleIcon sx={{ fontSize: 12, color: option.color }} />
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {option.label}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    <Stack direction='row' alignItems='center'>
                        <Tooltip title='cancel'>
                            <IconButton onClick={toggleIsEditting}>
                                <EditOffIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='edit data send'>
                            {/* isDirty는 useForm에 처음 주입된 defaultValues와 현재 입력값을 비교하여 변경 여부를 알려줌 */}
                            <span> {/* tooltip은 내부 요소에 이벤트를 수신해야하는데 iconbutton이 disabled 되면서 mui 경고가 뜸 -> span으로 감싸면 해결됨 */}
                                <IconButton disabled={!isDirty} onClick={handleEditConfirmOpen}>
                                    <SendIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title='delete task'>
                            <IconButton onClick={handleDeleteConfirmOpen}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Paper>
            <EditConfirm
                editConfirmOpen={editConfirmOpen}
                handleEditConfirmClose={handleEditConfirmClose}
                prevObj={prevObj}
                changeObj={changeObj}
                formId={`edit-task-form-${task._id}`}
            />
            <DeleteConfirm
                task={task}
                deleteConfirmOpen={deleteConfirmOpen}
                handleDeleteConfirmClose={handleDeleteConfirmClose}
            />
        </Box >
    )
}