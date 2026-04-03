import {
    Box, Typography, Stack,
    Divider,
} from '@mui/material';

import { useProjectStore } from '../../../../store/useProjectStore.js';
import { useEffect } from 'react';
import { useTaskStore } from '../../../../store/useTaskStore.js';
import ProjectTasks from './ProjectTasks.jsx';
import ProjectHeader from './ProjectHeader.jsx';
import ProjectBody from './ProjectBody.jsx';
import ArchiveOverlay from '../ArchiveOverlay.jsx';

export default function Project() {
    const selectedProject = useProjectStore(state => state.selectedProjectInWorkspace)
    const getTasksInWorkspaceProject = useTaskStore(state => state.getTasksInWorkspaceProject)

    const isArchivedProject = !!selectedProject?.archivedAt

    useEffect(() => {
        if (!selectedProject) return
        getTasksInWorkspaceProject(selectedProject._id)
    }, [selectedProject, getTasksInWorkspaceProject])


    if (!selectedProject) return <Typography variant='h5' textAlign='center'>프로젝트를 선택해주세요.</Typography>;

    const isDoneOrArchive = ['DONE', 'ARCHIVE'].includes(selectedProject.status)

    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 4,
            bgcolor: '#F9F8F6',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* 1. 헤더 영역: 제목 및 상태 */}
            <ProjectHeader />

            <Divider sx={{ mb: 3 }} />

            {/* 2. 바디 영역: tasks 및 description */}
            <Stack
                direction='row'
                spacing={3}
                sx={{
                    flex: 1,
                    minHeight: 0,
                }}>
                {/* tasks 영역 */}
                <ProjectTasks isDoneOrArchive={isDoneOrArchive} />

                {/* description 영역 */}
                <Stack direction='column' spacing={2} sx={{ flex: 1, }}>
                    <ProjectBody isDoneOrArchive={isDoneOrArchive} />
                </Stack>
                {isArchivedProject && <ArchiveOverlay />}

            </Stack>

        </Box >
    );
};