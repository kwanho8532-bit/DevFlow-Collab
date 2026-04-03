import {
    Box, Button, Dialog,
    DialogActions, DialogContent, DialogTitle,
    FormControl, FormHelperText, InputLabel,
    MenuItem, Select, TextField,
    Typography,
} from "@mui/material";

import CircleIcon from '@mui/icons-material/Circle';

import { useForm, Controller } from "react-hook-form";
import { importanceOptions } from "../../etc/importanceOptions.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTaskSchema } from "../../../schema/zod.js";
import { useProjectStore } from "../../../store/useProjectStore.js";
import { useTaskStore } from "../../../store/useTaskStore.js";


export default function AddTaskDialog({ open, handleClose }) {
    const selectedProject = useProjectStore(state => state.selectedProjectInWorkspace)
    const addTaskInWorkspaceProject = useTaskStore(state => state.addTaskInWorkspaceProject)

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { isValid },
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            taskName: '',
            userImportance: 'SUPPORT',
        },
        resolver: zodResolver(addTaskSchema)
    })

    const handleRegistration = async (formData) => {
        try {
            await addTaskInWorkspaceProject(selectedProject._id, formData)
        } catch (err) {
            console.log(err)
        } finally {
            reset()
            handleClose()
        }
    }

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={() => {
                reset()
                handleClose()
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '24px',
                        padding: '16px',
                        backgroundImage: 'none', // 다크모드 시 적용되는 오버레이 제거 (선택 사항)
                    },
                },
            }}
            fullWidth
            maxWidth="xs"
        >
            <Box
                onSubmit={handleSubmit(handleRegistration)}
                component="form"
                noValidate
                autoComplete="off"
            >
                <DialogTitle component='div' sx={{ pb: 1 }}>
                    <Typography variant="h5" fontWeight="700" color="#4c1c94">
                        새 태스크 추가
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        진행 상황을 관리하기 위해 새로운 할 일을 입력해 주세요.
                    </Typography>

                    <TextField
                        {...register('taskName')}
                        label="Task Name"
                        placeholder="예: 프로젝트 제안서 작성"
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '&.Mui-focused fieldset': {
                                    borderColor: '#4c1c94',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#4c1c94',
                            },
                        }}
                    />

                    <Controller
                        name="userImportance"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <FormControl fullWidth error={!!error} sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4c1c94',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#4c1c94',
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
                                {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />

                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!isValid}
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: '#4c1c94',
                            borderRadius: '10px',
                            px: 3,
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#3A1572',
                            }
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}