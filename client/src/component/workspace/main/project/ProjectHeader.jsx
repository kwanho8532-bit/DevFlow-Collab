import {
    Avatar, Box, Chip,
    Stack, Typography
} from "@mui/material";
import { useProjectStore } from "../../../../store/useProjectStore";
import { getPriority } from "../../../../utils/dateHelper";


export default function ProjectHeader() {
    const selectedProject = useProjectStore(state => state.selectedProjectInWorkspace)

    // D-Day 계산 로직 (간단 예시)
    const calcDay = getPriority(selectedProject.deadline)

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mb: 3, minHeight: 0, flexShrink: 0 }}>
            <Box>
                <Typography variant="h5" sx={{ fontSize: '30px', fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                    {selectedProject.projectName || "알파 프로젝트"} {/* 데이터에 이름이 없다면 예시로 */}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Chip
                        label={calcDay.label}
                        sx={{
                            height: '24px',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            bgcolor: calcDay.color,
                            color: '#eee'
                        }}
                    />
                    <Chip
                        label={selectedProject.status}
                        sx={{
                            height: '24px',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            bgcolor: '#06B6D4',
                            color: '#eee'
                        }}
                    />
                </Stack>
            </Box>

            {/* 아바타 영역 (Owner) */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ height: '100%', }}>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedProject.owner.username}</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedProject.owner.email}</Typography>
                </Box>
                <Avatar
                    src={selectedProject.owner.profileImg}
                    sx={{ width: 40, height: 40, }}
                >
                    {selectedProject.owner.username[0]}
                </Avatar>
            </Stack>
        </Stack>
    )
}