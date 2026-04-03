import {
    Box, Button, Dialog,
    DialogActions, DialogContent, DialogTitle,
    Stack, TextField, Typography
} from "@mui/material";

import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, useForm } from "react-hook-form";
import { addProjectSchema } from "../../../schema/zod.js";
import dayjs from "dayjs";
import { useProjectStore } from "../../../store/useProjectStore.js";
import { useWorkspaceStore } from "../../../store/useWorkspaceStore.js";


export default function AddProjectDialog({ open, handleClose }) {
    const {
        register,
        control,
        handleSubmit,
        formState: { isValid, errors },
        reset,
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            projectName: '',
            description: '',
            deadline: dayjs()
        },
        resolver: zodResolver(addProjectSchema)
    })

    const selectedWorkspace = useWorkspaceStore(state => state.selectedWorkspace)
    const addProjectInWorkspace = useProjectStore(state => state.addProjectInWorkspace)

    // addProject 하는 서버 로직 & handleRegistration만들기
    // Project edit & delete로직 주말에 만들기

    // -> addProject는 만들었으니까. edit & delete 만들기

    const handleRegistration = async (formData) => {
        try {
            await addProjectInWorkspace(formData, selectedWorkspace._id)
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
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '32px', // 메인 Paper(40px)와 조화를 이루는 곡률
                        padding: '12px',
                        backgroundImage: 'none',
                    }
                }
            }}
        >
            <Box
                onSubmit={handleSubmit(handleRegistration)}
                component="form"
                noValidate
                autoComplete="off"
            >
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center', pt: 3, }} component="div">
                    <Typography variant="h5" fontWeight="800" color="#4c1c94" >
                        Add New Project
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Stack direction='column' spacing={1} sx={{ mt: 1 }}>
                        <TextField
                            {...register('projectName')}
                            fullWidth
                            id="projectName"
                            label="Project Name"
                            variant="outlined"
                            error={!!errors.projectName}
                            helperText={errors.projectName?.message || ' '}
                            slotProps={{
                                input: { sx: { borderRadius: '15px' } }
                            }}
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
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name="deadline"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        {...field}
                                        format="YYYY.MM.DD"
                                        label='Deadline'
                                        minDate={dayjs()}
                                        slotProps={{
                                            textField: {
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#4c1c94',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#4c1c94',
                                                    }
                                                },
                                                fullWidth: true,
                                                error: !!error?.deadline,
                                                helperText: error?.deadline?.message || ' ',
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
                            fullWidth
                            id="description"
                            label="Description"
                            variant="outlined"
                            error={!!errors.description}
                            helperText={errors.description?.message || ' '}
                            multiline
                            rows={4}
                            slotProps={{
                                input: { sx: { borderRadius: '15px' } }
                            }}
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
                        />

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 3, gap: 1 }}>
                    <Button
                        onClick={() => {
                            reset()
                            handleClose()
                        }}
                        sx={{
                            borderRadius: '999px',
                            px: 3,
                            color: 'text.secondary',
                            fontWeight: '600',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.1)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isValid}
                        variant="contained"
                        sx={{
                            borderRadius: '999px',
                            px: 4,
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
                        Create Project
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}