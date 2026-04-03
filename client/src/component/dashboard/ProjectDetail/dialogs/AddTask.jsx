import {
    Button, TextField, Dialog,
    DialogActions, DialogContent, DialogTitle,
    Typography, Box, FormControl,
    Select, InputLabel, MenuItem,
    FormHelperText
} from '@mui/material';

import CircleIcon from '@mui/icons-material/Circle';

import { Controller, useForm } from 'react-hook-form';
import { useProjectStore } from '../../../../store/useProjectStore.js';
import { useTaskStore } from '../../../../store/useTaskStore.js';

import { importanceOptions } from '../../../etc/importanceOptions.jsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTaskSchema } from '../../../../schema/zod.js';

export default function AddTask({ open, handleClose }) {
    const getTasks = useTaskStore(state => state.getTasks)
    const selectedProject = useProjectStore(state => state.selectedProject)
    const addTask = useTaskStore(state => state.addTask)

    const {
        register,
        control,
        handleSubmit,
        formState: { isValid },
        reset,

    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        // values: selectedProject, // 특정 객체(selectedProject)가 변경되면 이를 감지하여 값을 변경시킴
        defaultValues: { taskName: '', userImportance: 'SUPPORT' },
        resolver: zodResolver(addTaskSchema)
    })

    const handleRegistration = async (formData) => {
        try {
            await addTask(selectedProject._id, formData)
        } catch (err) {
            console.log(err)
        } finally {
            getTasks(selectedProject._id)
            reset()
            handleClose()
        }
    }


    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={() => {
                reset();
                handleClose();
            }}
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
                    <Typography variant="h5" fontWeight="700" color="#064E3B">
                        새 태스크 추가
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        진행 상황을 관리하기 위해 새로운 할 일을 입력해 주세요.
                    </Typography>

                    <TextField
                        {...register('taskName')}
                        autoFocus
                        label="Task Name"
                        placeholder="예: 프로젝트 제안서 작성"
                        fullWidth
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
                        }}
                    />

                    <Controller
                        name="userImportance"
                        control={control}
                        defaultValue="SUPPORT" // 기본값 설정
                        render={({ field, fieldState: { error } }) => (
                            <FormControl fullWidth error={!!error} sx={{ mt: 2 }}>
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
                        sx={{ color: 'text.secondary', fontWeight: 'bold' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!isValid}
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: '#064E3B',
                            borderRadius: '10px',
                            px: 3,
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#053f30',
                            }
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}