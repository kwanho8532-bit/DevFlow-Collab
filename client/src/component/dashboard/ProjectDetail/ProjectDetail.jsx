import {
    Grid, Paper, Box,
    Stack,
    Chip,
    Button,

} from '@mui/material';

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';

import Header from './header/Header';
import Task from './body_task/Task';
import Body from './body/Body.jsx';
import ProjectEditButton from './body/ProjectEditButton.jsx';

import { useProjectStore } from '../../../store/useProjectStore.js';
import { useTaskStore } from '../../../store/useTaskStore.js';
import DeadlineOverlay from './overlay/DeadlineOverlay.jsx';
import ArchivedOverlay from './overlay/ArchivedOverlay.jsx';
import ProjectDeleteButton from './body/ProjectDeleteButton.jsx';


export default function ProjectDetail() {
    const { id } = useParams();
    const selectedProject = useProjectStore(state => state.selectedProject)
    const getSelectedProject = useProjectStore(state => state.getSelectedProject)
    const isDeadlinePassed = useProjectStore(state => {
        const deadline = state?.selectedProject?.deadline
        if (!deadline) return false
        return dayjs(deadline).isBefore(dayjs(), 'day')
    })

    const tasks = useTaskStore(state => state.tasks)
    const getTasks = useTaskStore(state => state.getTasks)


    useEffect(() => {
        getSelectedProject(id)
    }, [id])

    useEffect(() => {
        if (!selectedProject) return
        getTasks(selectedProject._id)
    }, [selectedProject])


    if (!selectedProject) return null

    const STATUS_TRANSITION = {
        PLANNING: 'IN_PROGRESS',
        IN_PROGRESS: 'DONE',
        DONE: 'ARCHIVED'
    }

    const currentStatus = selectedProject?.status
    const nextStatus = STATUS_TRANSITION[currentStatus]

    return (
        <Box sx={{
            bgcolor: '#064E3B',
            minHeight: '100vh',
            p: { xs: 2, md: 4 },
            position: 'relative'
        }}>
            {/* 이미지의 둥근 흰색 배경 스타일 유지 */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '40px',
                    minHeight: '85vh',
                    p: { xs: 3, md: 5 },
                    overflow: 'hidden',
                    maxWidth: '700px', // 원하는 최대 너비 (예: 1000px, 1200px 등)
                    width: '100%',      // 모바일 등 작은 화면에서는 꽉 차게
                    mx: 'auto',        // 가로 방향으로 중앙 정렬
                }}
            >
                {/* 상단 헤더: 뒤로가기 + 제목 */}
                <Header currentStatus={currentStatus} />

                <Grid container spacing={4} direction='column'>

                    {/* task 관련 요소들 */}
                    <Task />

                    {/* project 개요 및 status transition */}
                    <Body
                        id={id}
                        currentStatus={currentStatus}
                        nextStatus={nextStatus}
                    />

                    {/* edit button */}
                    <Stack direction='column' spacing={1}>
                        <ProjectEditButton />
                        <ProjectDeleteButton />
                    </Stack>

                </Grid>

                {/* 아카이브 또는 deadline이 지난 경우 그 어떤 편집도 허용하지 않도록 오버레이를 위에 씌움 */}
                {selectedProject.archivedAt ?
                    <ArchivedOverlay />
                    :
                    isDeadlinePassed && <DeadlineOverlay />
                }

            </Paper>
        </Box >
    );
}
