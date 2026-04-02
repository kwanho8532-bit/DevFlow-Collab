import {
    Box, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import EditOffIcon from '@mui/icons-material/EditOff';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTaskSchema } from "../../../../schema/zod";
import { importanceOptions } from "../../../etc/importanceOptions";
import { useTaskStore } from "../../../../store/useTaskStore";
import TaskEditConfirm from "../../dialogs/TaskEditConfirm";
import { useState } from "react";
import TaskDeleteConfirm from "../../dialogs/TaskDeleteConfirm";

export default function TaskItemEdit({ task, handleEditToggle }) {
    const editTaskInWorkspace = useTaskStore(state => state.editTaskInWorkspace)
    const [taskEditConfirmOpen, setTaskEditConfirmOpen] = useState(false)
    const [taskDeleteConfirmOpen, setTaskDeleteConfirmOpen] = useState(false)


    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isValid, errors, isDirty },
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

    const handleReigstration = async (formData) => {
        try {
            await editTaskInWorkspace(formData, task._id)
            handleEditToggle()
        } catch (err) {
            console.log(err.response)
        }
    }

    const handleTaskEditConfirmDialogOpen = () => {
        setTaskEditConfirmOpen(true)
    }

    const handleTaskEditConfirmDialogClose = () => {
        setTaskEditConfirmOpen(false)
    }

    const handleTaskDeleteConfirmDialogOpen = () => {
        setTaskDeleteConfirmOpen(true)
    }

    const handleTaskDeleteConfirmDialogClose = () => {
        setTaskDeleteConfirmOpen(false)
    }



    return (
        <Box
            id={`task-edit-form-${task._id}`}
            onSubmit={handleSubmit(handleReigstration)}
            component="form"
            noValidate
            autoComplete="off"
        >
            <Stack direction='row' spacing={1} sx={{ p: 2 }} >
                <TextField
                    {...register('taskName')}
                    id="taskName"
                    label="Task Name"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&.Mui-focused fieldset': {
                                borderColor: '#4c1d95',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#4c1d95',
                        },
                        flex: 1,
                    }}
                />

                <Controller
                    name="userImportance"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormControl
                            fullWidth
                            error={!!errors.userImportance}
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4c1d95',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#4c1d95',
                                },
                            }}
                        >
                            <InputLabel id="importance-select-label">Importance</InputLabel>
                            <Select
                                {...field}
                                labelId="importance-select-label"
                                label="Importance"
                                sx={{
                                    borderRadius: '8px',


                                }}
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
                <Stack direction='row' alignItems='center' >
                    <Tooltip title='Cancel'>
                        <IconButton size="small" onClick={handleEditToggle} >
                            <EditOffIcon sx={{ fontSize: '20px' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Submit'>
                        <span>
                            <IconButton size="small" disabled={!isDirty || !isValid} onClick={handleTaskEditConfirmDialogOpen}  >
                                <SendIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title='Delete'>
                        <IconButton onClick={handleTaskDeleteConfirmDialogOpen}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

            </Stack>
            {/* 상황별 다이얼로그 */}
            <TaskEditConfirm
                handleClose={handleTaskEditConfirmDialogClose}
                open={taskEditConfirmOpen}
                prevObj={prevObj}
                changeObj={changeObj}
                formId={`task-edit-form-${task._id}`}
            />
            <TaskDeleteConfirm
                task={task}
                handleClose={handleTaskDeleteConfirmDialogClose}
                open={taskDeleteConfirmOpen}
            />

        </Box >

    )
}