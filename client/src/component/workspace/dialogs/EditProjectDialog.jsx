import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, useForm } from "react-hook-form";
import { useProjectStore } from "../../../store/useProjectStore";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProjectSchema } from "../../../schema/zod.js";

export default function EditProjectDialog({ open, handleClose }) {
    const selectedProjectInWorkspace = useProjectStore(state => state.selectedProjectInWorkspace)
    const editProjectInWorkspace = useProjectStore(state => state.editProjectInWorkspace)

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { isValid, errors, isDirty },
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        values: {
            projectName: selectedProjectInWorkspace.projectName,
            description: selectedProjectInWorkspace.description,
            deadline: dayjs(selectedProjectInWorkspace.deadline)
        },
        resolver: zodResolver(editProjectSchema)
    })
    const isBefore = dayjs(selectedProjectInWorkspace.deadline).isBefore(dayjs(), 'day')

    const handleRegistration = async (formData) => {
        try {
            await editProjectInWorkspace(formData, selectedProjectInWorkspace._id)
            reset()
            handleClose()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={handleClose}
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
                    <Typography variant="h5" textAlign='center' fontWeight="700" color="#4c1c94">
                        프로젝트 수정
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pb: 1 }}>
                    <Typography variant="body2" color='text.secondary' mb={3}>
                        계획이 바뀌었나요? 더 정확한 목표 관리를 위해 프로젝트 정보를 업데이트해 주세요.
                    </Typography>
                    <Stack direction='column' spacing={1}>
                        <TextField
                            {...register('projectName')}
                            id="projectName"
                            label="Project Name"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4c1c94',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#4c1c94',
                                },
                            }}
                            slotProps={{
                                input: { sx: { borderRadius: '15px' } }
                            }}
                            error={!!errors.projectName}
                            helperText={errors?.projectName?.message || ' '}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                control={control}
                                name="deadline"
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        {...field}
                                        disabled={isBefore}
                                        label='Deadline'
                                        format="YYYY/MM/DD"
                                        minDate={dayjs()}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!error?.deadline,
                                                helperText: error?.deadline?.message ||
                                                    isBefore ?
                                                    '마감기한이 지난 프로젝트의 마감기한은 수정할 수 없습니다.'
                                                    :
                                                    ' ',
                                                slotProps: {
                                                    input: { sx: { borderRadius: '15px' } }
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <TextField
                            {...register('description')}
                            id="description"
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#4c1c94',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#4c1c94',
                                },
                            }}
                            slotProps={{
                                input: { sx: { borderRadius: '15px' } }
                            }}
                            error={!!errors.description}
                            helperText={errors?.description?.message || ' '}
                        />

                    </Stack>

                </DialogContent>
                <DialogActions sx={{ p: 0, pr: 3 }}>
                    <Button
                        sx={{
                            borderRadius: '999px',
                            px: 4,
                            color: 'text.secondary',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                        }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!isValid || !isDirty}
                        type="submit"
                        autoFocus
                        sx={{
                            borderRadius: '999px',
                            px: 3,
                            py: 1,
                            bgcolor: '#4c1c94', // 테마 컬러 적용
                            color: '#fff',
                            fontWeight: '700',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#3a1572',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'rgba(76, 28, 148, 0.12)', // 테마 컬러의 투명도 버전
                                color: 'rgba(6, 78, 59, 0.3)',
                            }
                        }}
                    >
                        Edit
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}