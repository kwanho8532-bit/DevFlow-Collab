import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    TextField,
    Stack,
    Typography,

} from "@mui/material";

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useForm, Controller } from 'react-hook-form'
import api from '../api/axios.js'
import dayjs from 'dayjs'
import { useProjectStore } from "../../store/useProjectStore.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { addProjectSchema } from "../../schema/zod.js";

// addProject 클릭 시 project 생성하는 로직 구현
// 그렇게 하고 나서 auth(유저)의 projectMember의 lastAccessedAt을 
// sort 해서 가져오는 '/api/me/currProject' 다시 연습해보기
// 그렇게 가져와서 kanban 보드 채우기(종이보고)
// useCurrProjectStore 더 채우거나, 활용하기

export default function AddProject({ open, handleClose }) {
    const addProject = useProjectStore(state => state.addProject)
    const getProjects = useProjectStore(state => state.getProjects)
    const projects = useProjectStore(state => state.projects)

    const {
        register,
        control,
        handleSubmit,
        formState: { isValid, errors },
        reset,
        setError,
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

    const handleRegistration = async (formData) => {
        try {
            addProject(formData)
        } catch (err) {
            console.log(err.response)
        } finally {
            reset()
            handleClose()
        }
    }

    const textFieldStyle = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#064E3B',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#064E3B',
        },
    };

    // 주소가 archived일 때 add Project를 누르면 dialog띄워서
    // kanban board로 이동해야 가능하다는 문구를 랜더하고, 이동 버튼 랜더링

    return (
        <Dialog
            disableAutoFocus
            disableEnforceFocus
            disableRestoreFocus
            open={open}
            onClose={() => {
                reset();
                handleClose();
            }}
            fullWidth
            maxWidth="xs"
            // 최신 MUI v6 슬롯 방식 적용
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '32px', // 메인 Paper(40px)와 조화를 이루는 곡률
                        padding: '12px',
                        backgroundImage: 'none',
                    },
                },
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit(handleRegistration)}
                noValidate
                autoComplete="off"
            >
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center', pt: 3 }} component="div">
                    <Typography variant="h5" fontWeight="800" color="#064E3B">
                        Add New Project
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Stack direction='column' spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            {...register('projectName', { required: '프로젝트 이름을 입력해주세요.' })}
                            fullWidth
                            id="projectName"
                            label="Project Name"
                            variant="outlined"
                            error={!!errors.projectName}
                            helperText={errors.projectName?.message}
                            slotProps={{
                                input: { sx: { borderRadius: '15px' } }
                            }}
                            sx={textFieldStyle}
                        />

                        {/* 🌟 마감 기한 추가 (DatePicker) */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name="deadline"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        format="YYYY.MM.DD"
                                        label="Deadline"
                                        minDate={dayjs()} // 오늘 이전 날짜 선택 불가
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                sx: textFieldStyle,
                                                error: !!errors.deadline,
                                                helperText: errors.deadline?.message,
                                                // Input에 곡률 적용
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
                            {...register('description', { required: '설명을 입력해주세요.' })}
                            fullWidth
                            id="description"
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            slotProps={{
                                input: { sx: { borderRadius: '15px' } }
                            }}
                            sx={textFieldStyle}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3, gap: 1 }}>
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
                        Create Project
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}