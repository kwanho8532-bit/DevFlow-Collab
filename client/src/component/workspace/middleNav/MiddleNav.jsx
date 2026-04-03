import {
    Box, Button, Chip,
    Stack,
} from "@mui/material";

import { useProjectStore } from "../../../store/useProjectStore.js";
import Element from "./Element.jsx";
import AddIcon from '@mui/icons-material/Add';
import AddProjectDialog from "../dialogs/AddProjectDialog.jsx";
import { useState } from "react";
import { useWorkspaceStore } from "../../../store/useWorkspaceStore.js";

export default function MiddleNav() {
    const projectsInSelectedWorkspace = useProjectStore(state => state.projectsInSelectedWorkspace)
    const selectedWorkspace = useWorkspaceStore(state => state.selectedWorkspace)


    const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false)

    const handleAddProjectDialogOpen = () => {
        setAddProjectDialogOpen(true)
    }

    const handleAddProjectDialogClose = () => {
        setAddProjectDialogOpen(false)
    }


    return (
        <Box sx={{
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },  // 스크롤바 숨기기
            }}>
                <Stack direction='row' justifyContent='center' sx={{ mt: 2 }}>
                    <Box>
                        <Chip
                            label={selectedWorkspace?.workspaceName}
                            variant="outlined" // 혹은 'filled'
                            sx={{
                                height: '28px',
                                bgcolor: 'rgba(167, 139, 250, 0.2)', // 은은한 보라빛 배경
                                color: '#E9D5FF', // 밝은 텍스트 컬러로 가독성 확보
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                borderRadius: '8px', // 보드 테두리와 맞춘 부드러운 곡선
                                border: '1px solid rgba(167, 139, 250, 0.4)',
                                '& .MuiChip-label': {
                                    px: 1.5,
                                },
                            }}
                        />
                    </Box>
                </Stack>
                <Stack direction='column' alignItems='center' sx={{ mt: 3, mb: 1 }}>
                    <Button
                        onClick={handleAddProjectDialogOpen}
                        startIcon={<AddIcon />}
                        sx={{
                            width: '85%',
                            color: '#fff',
                            bgcolor: '#A78BFA',
                            borderRadius: '999px'
                        }}>
                        Add Project
                    </Button>
                </Stack>

                {/* dialog */}
                <AddProjectDialog open={addProjectDialogOpen} handleClose={handleAddProjectDialogClose} />

                {/* middle nav 스타일 정하고, 버튼처럼 만들어서
            클릭하면 main에 projectDetail처럼 내용 띄우기 */}
                {projectsInSelectedWorkspace
                    .filter(project => !project.archivedAt)
                    .map(project => <Element key={project._id} project={project} />)}
            </Box>
        </Box >
    )
}