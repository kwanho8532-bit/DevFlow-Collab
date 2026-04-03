import {
    Box, Container, Grid,
    Typography, Paper
} from "@mui/material";

import SpeedIcon from '@mui/icons-material/Speed';
import CodeIcon from '@mui/icons-material/Code';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export default function CoreValue() {
    return (
        <Box id='core-value' sx={{ py: 20 }}>
            <Container maxWidth="lg" sx={{}}>
                <Typography
                    variant="h4"
                    textAlign="center"
                    sx={{ fontWeight: 'bold', mb: 8, color: '#333' }}
                >
                    왜 DevFlow를 선택해야 할까요?
                </Typography>

                <Grid container spacing={4}>
                    {[
                        {
                            title: 'Zero Learning Curve',
                            desc: '학습 없이 바로 시작하는 직관적인 UI로 팀의 적응 시간을 최소화합니다.',
                            icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
                        },
                        {
                            title: 'Focus on Logic',
                            desc: '복잡한 설정 없이 칸반보드와 이슈 트래킹을 하나로 통합했습니다. 오직 코드와 로직에만 집중하세요.',
                            icon: <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
                        },
                        {
                            title: 'Seamless Feedback',
                            desc: '코드 리뷰와 피드백을 한 곳에서 관리하세요. 기록이 남는 히스토리 관리로 팀의 성장을 돕습니다.',
                            icon: <QuestionAnswerIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
                        },
                    ].map((value, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    textAlign: 'center',
                                    borderRadius: '24px',
                                    bgcolor: 'background.paper',
                                    border: '2px solid #eee',
                                    transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)', // 부드러운 가속도 곡선
                                    '&:hover': {
                                        // 1. 위로 이동
                                        transform: 'translateY(-12px)',
                                        // 2. 그림자를 더 깊고 넓게 (더 높이 떠오른 느낌)
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                        // 3. 테두리 색상을 브랜드 컬러로 살짝 강조 (선택 사항)
                                        borderColor: 'primary.light',
                                    },
                                }}
                            >
                                <Box sx={{ mb: 2 }}>{value.icon}</Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    {value.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                                    {value.desc}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}