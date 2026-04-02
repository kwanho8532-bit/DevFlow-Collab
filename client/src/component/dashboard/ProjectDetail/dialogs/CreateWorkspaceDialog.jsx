import {
    Box, Button, Dialog,
    DialogActions, DialogContent, DialogTitle,
    FormControl, FormHelperText, InputLabel,
    MenuItem, Select, TextField,
    Typography,
} from "@mui/material";
import { createWorkspace as createWorkspaceSchema } from "../../../../schema/zod.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useWorkspaceStore } from "../../../../store/useWorkspaceStore.js";

export default function CreateWorkspaceDialog({ open, handleClose }) {
    const createWorkspace = useWorkspaceStore(state => state.createWorkspace)
    const workspaces = useWorkspaceStore(state => state.workspaces)

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { isValid, errors },
    } = useForm({
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: { workspaceName: '' },
        resolver: zodResolver(createWorkspaceSchema)
    })

    const handleRegistration = async (formData) => {
        const { workspaceName } = formData

        if (workspaces.some(ws => ws.workspaceName === workspaceName)) {
            return setError('root', {
                type: 'Duplication',
                message: '중복된 값입니다. 다른 값을 설정해주세요.'
            })

        } else {
            await createWorkspace(formData)
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
                        새 작업 공간 추가
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        프로젝트를 함께 진행할 팀원들과 소통할 수 있는 <br />
                        새 공간을 만들어보세요.
                    </Typography>

                    <TextField
                        {...register('workspaceName')}
                        label="Workspace Name"
                        placeholder="작업 공간의 이름을 지어주세요!"
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
                        error={!!errors?.root}
                        helperText={errors?.root?.message || ''}
                    />


                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => {
                            reset()
                            handleClose()
                        }}
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