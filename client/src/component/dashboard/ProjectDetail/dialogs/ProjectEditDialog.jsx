import {
    Box, Button, Dialog,
    DialogActions, DialogContent, DialogTitle,
    Stack, TextField, Typography
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { useProjectStore } from "../../../../store/useProjectStore.js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProjectSchema } from "../../../../schema/zod.js";
import { useEffect } from "react";


export default function ProjectEditDialog({ open, handleClose }) {
    const selectedProject = useProjectStore(state => state.selectedProject)
    const editProject = useProjectStore(state => state.editProject)

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { isValid, errors }
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            projectName: selectedProject.projectName,
            description: selectedProject.description,
            deadline: dayjs(selectedProject.deadline)
        },
        resolver: zodResolver(addProjectSchema)
    })


    const handleRegistration = (data) => {
        editProject(data, selectedProject._id)
        reset()
        handleClose()
    }

    useEffect(() => {
        if (selectedProject) {
            reset({
                projectName: selectedProject.projectName,
                description: selectedProject.description,
                deadline: dayjs(selectedProject.deadline)
            })
        }
    }, [selectedProject, reset])

    const textFieldStyle = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#064E3B',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#064E3B',
        },
    }

    // datePicker 사용하는거 다시 써보기 && edit tasks 로직 만들기

    // deadline이 지났다면 오늘보다 이전 선택 방지 / 지나지 않았다면 deadline으로 설정
    const minAllowedDate = dayjs(selectedProject.deadline).isBefore(dayjs(), 'day') ?
        dayjs(selectedProject.deadline) : dayjs()

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={() => {
                handleClose()
                reset()
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
                    <Typography variant="h5" fontWeight="700" color="#064E3B">
                        프로젝트 수정
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pb: 1 }}>
                    <Typography variant="body2" color='text.secondary' mb={3}>
                        계획이 바뀌었나요? 더 정확한 목표 관리를 위해 프로젝트 정보를 업데이트해 주세요.
                    </Typography>
                    <Stack direction='column' spacing={2}>
                        <TextField
                            fullWidth
                            {...register('projectName')}
                            id='projectName'
                            label='Project Name'
                            variant="outlined"
                            sx={textFieldStyle}
                        />
                        <TextField
                            fullWidth
                            {...register('description')}
                            id='description'
                            label='Description'
                            variant="outlined"
                            sx={textFieldStyle}
                            multiline
                            rows={5}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                control={control}
                                name="deadline"
                                defaultValue={selectedProject.deadline}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        label='Deadline'
                                        format="YYYY/MM/DD"
                                        minDate={minAllowedDate}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                sx: textFieldStyle,
                                                error: !!errors.deadline,
                                                helperText: errors.deadline?.message,
                                                slotProps: {
                                                    input: {
                                                        sx: { borderRadius: '12px' }
                                                    }
                                                }

                                            }
                                        }}
                                    />


                                )}

                            />

                        </LocalizationProvider>
                    </Stack>


                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button sx={{
                        borderRadius: '999px',
                        px: 4,
                        color: 'text.secondary',
                        fontWeight: 600,
                        '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                    }}
                        onClick={() => {
                            handleClose()
                            reset()
                        }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isValid}
                        autoFocus
                        sx={{
                            borderRadius: '999px',
                            px: 4,
                            py: 1,
                            bgcolor: '#064E3B', // 테마 컬러 적용
                            color: '#fff',
                            fontWeight: '700',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#053f30',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'rgba(6, 78, 59, 0.12)', // 테마 컬러의 투명도 버전
                                color: 'rgba(6, 78, 59, 0.3)',
                            }
                        }}
                    >
                        Edit
                    </Button>
                </DialogActions>
            </Box >
        </Dialog>
    )
}