import {
    Grid,
    Typography,
    Paper,
    Button,
    Stack,
    Box,
    Chip,

} from '@mui/material'
import dayjs from 'dayjs'
import { Link, useNavigate } from 'react-router'
import { getPriority } from '../../../utils/dateHelper.js'
import { useProjectStore } from '../../../store/useProjectStore.js'
import { useEffect } from 'react'
import { useSearchStore } from '../../../store/useSearchStore.js'

// status prop을 kanban에서 넘어온 projects로 바꾸고 status값을 참조하는 것도 projects로 바꾸기
export default function KanbanCoulmn({ title, projects }) {
    const getProjects = useProjectStore(state => state.getProjects)

    // 만약 projectMember가 많아지게 되면 메모이제이션 하는게 좋음
    // 그러나 지금은 projectMember가 몇개 안돼서 useMemo하는게 오히려 성능을 저하시킬 수 있음
    //  const filteredProject = useMemo(
    //         () => (
    //             projectMember.filter(pm => pm.project.status === status)
    //         ), [projectMember, status])


    useEffect(() => {
        async function getProject() {
            await getProjects()
        }
        getProject()
    }, [getProjects])


    return (
        <Grid size={4} sx={{ height: '100%', }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%', // 🌟 부모로부터 받은 높이 100% 사용
                maxHeight: '100%'
            }}>
                <Typography
                    variant="h5"
                    textAlign='center'
                    color="success"
                    sx={{
                        borderBottom: '1px solid',
                        pb: 1,
                        mb: 1
                    }}
                >
                    {title}
                </Typography>
                <Stack
                    direction='column'
                    spacing={1}
                    sx={{
                        flexGrow: 1,      // 🌟 남은 세로 공간을 다 채움
                        overflowY: 'auto', // 🌟 내용이 많아지면 세로 스크롤 생성
                        overflowX: 'hidden',
                        p: 1,             // 스크롤바와 카드 사이 여유 공간
                        '&::-webkit-scrollbar': { width: '5px' }, // 스크롤바 디자인
                        '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '10px' }
                    }}>

                    {projects?.map(pm => {
                        // 1. 각 프로젝트의 deadline을 가지고 우선순위 정보를 가져옵니다.
                        const priority = getPriority(pm.project.deadline);

                        return (
                            <Paper
                                key={pm._id}
                                component={Link}
                                to={`/project/${pm.project._id}`}
                                elevation={4}
                                sx={{
                                    textDecoration: 'none',
                                    p: 2,
                                    width: '100%',
                                    position: 'relative', // 🌟 Chip 위치 조절을 위해 relative 설정
                                    '&:hover': {
                                        bgcolor: '#f5f5f5',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                {/* 2. Chip 렌더링 (우측 상단 배치 예시) */}
                                {/* 🌟 flex-wrap을 허용하고, 화면이 작아지면 column으로 변경 */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' }, // 🌟 xs(모바일)에선 세로, sm(이상)에선 가로
                                    justifyContent: 'space-between',
                                    alignItems: { xs: 'flex-start', md: 'flex-start' },
                                    gap: 1, // 🌟 요소 사이의 최소 간격 확보
                                    mb: 0.5
                                }}>
                                    <Typography variant="caption" color="primary.main" fontSize={10} sx={{ whiteSpace: 'nowrap' }}>
                                        {dayjs(pm.project.createAt).format('YYYY.MM.DD')}
                                    </Typography>

                                    {priority &&
                                        <Chip
                                            label={priority.label}
                                            size="small"
                                            sx={{
                                                height: '20px',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                bgcolor: priority.color,
                                                // 🌟 세로 정렬 시 Chip이 너무 길어지지 않게 설정
                                                maxWidth: 'fit-content'
                                            }}
                                        />
                                    }
                                </Box>

                                <Typography variant="subtitle1" fontSize={16} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                    <b>{pm.project.projectName}</b>
                                </Typography>

                                <Typography variant="body1" color="text.secondary" fontSize={12}>
                                    {pm.project.status}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Stack>
            </Box>
        </Grid>
    )
}