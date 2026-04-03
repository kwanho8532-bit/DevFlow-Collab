import {
    Box, Chip, IconButton,
    Stack, Typography
} from "@mui/material"

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import dayjs from 'dayjs';
import { useProjectStore } from "../../../../store/useProjectStore.js";
import { getPriority } from "../../../../utils/dateHelper.js";

export default function Header({ currentStatus }) {
    const selectedProject = useProjectStore(state => state.selectedProject)
    const deadlineStyle = getPriority(selectedProject?.deadline)

    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <IconButton onClick={() => window.history.back()} sx={{ color: '#10B981' }}>
                <ArrowBackIosNewIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}> {/* flexGrow를 주어 공간 확보 */}
                <Typography variant="caption" color="text.secondary">
                    {dayjs(selectedProject?.createAt).format('YYYY.MM.DD')} 생성
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#111', lineHeight: 1.2 }}>
                    {selectedProject?.projectName}
                </Typography>

                {/* 🌟 Deadline 섹션 추가 */}
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        마감 {dayjs(selectedProject?.deadline).format('YYYY.MM.DD')}
                    </Typography>

                    {/* D-Day를 강조하는 작은 뱃지 */}
                    {selectedProject.status === 'DONE' ?
                        <Box sx={{
                            px: 1,
                            py: 0.2,
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            bgcolor: '#E5E7EB',
                            color: '#1F2937',
                        }}>
                            {selectedProject.status}
                        </Box>
                        :
                        <Box sx={{
                            px: 1,
                            py: 0.2,
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            bgcolor: `${deadlineStyle.color}20`,
                            color: deadlineStyle.color,
                        }}>

                            <span>
                                {deadlineStyle.diffDays < 0
                                    ? 'EXPIRED'
                                    : deadlineStyle.diffDays === 0
                                        ? 'TODAY'
                                        : `D-${deadlineStyle.diffDays}`}
                            </span>
                        </Box>
                    }

                </Stack>
            </Box>
            <Chip
                label={currentStatus}
                sx={{ fontWeight: 'bold', px: 1, bgcolor: '#10B981', color: '#fff' }}
            />
            <Chip
                label={deadlineStyle.label}
                sx={{ fontWeight: 'bold', px: 1, bgcolor: deadlineStyle.color, color: '#fff' }}
            />
        </Stack>
    )
}