import {
    Box, Container, Grid,
    Typography
} from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function FeatureDetail() {
    const features = [
        {
            title: "명확한 칸반 보드",
            subtitle: "진행 상황의 시각화",
            desc: "팀의 전체 업무 흐름을 한눈에 파악하세요. 복잡한 액션 없이도 각 작업의 상태를 명확하게 시각화하여, 어떤 업무가 정체되어 있고 어떤 업무가 완료되었는지 직관적으로 확인할 수 있습니다.",
            img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
            points: ["단계별 작업 상태 가시화", "업무 우선순위 파악", "불필요한 미팅 감소"]
        },
        {
            title: "실시간 협업 메시징",
            subtitle: "팀원과의 즉각적인 소통",
            desc: "작업 중 궁금한 점이 생기면 즉시 대화를 시작하세요. 별도의 메신저로 이동할 필요 없이 DevFlow 안에서 팀원들과 메시지를 주고받으며 빠른 의사결정과 긴밀한 협업이 가능해집니다.",
            img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            points: ["팀 내 실시간 메시지 교환", "협업 맥락 유지", "신속한 피드백 공유"],
            reverse: true // 이미지와 텍스트 위치 반전
        },
        {
            title: "안전한 아카이브 관리",
            subtitle: "소중한 업무 기록의 보존",
            desc: "완료된 프로젝트나 더 이상 활성화되지 않는 작업들을 아카이브에 안전하게 보관하세요. 필요할 때 언제든 다시 찾아볼 수 있어 팀의 소중한 업무 히스토리가 자산으로 남게 됩니다.",
            img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
            points: ["간편한 아카이브 전환", "완료 업무 리스트 관리", "언제든 가능한 데이터 조회"]
        }
    ];

    return (
        <Box id='feature-detail' sx={{ pb: 15 }}>
            <Container maxWidth="lg">
                {features.map((feature, index) => (
                    <Grid
                        container
                        spacing={8}
                        alignItems="center"
                        key={index}
                        sx={{ mb: 10, flexDirection: { xs: 'column-reverse', md: feature.reverse ? 'row-reverse' : 'row' } }}
                    >
                        {/* 텍스트 영역 */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '1rem' }}>
                                {feature.subtitle}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: '800', mt: 1, mb: 3, wordBreak: 'keep-all' }}>
                                {feature.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                                {feature.desc}
                            </Typography>

                            {/* 포인트 리스트 */}
                            <Box sx={{ mb: 4 }}>
                                {feature.points.map((point, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                        <CheckCircleOutlineIcon sx={{ mr: 1, color: 'primary.main', fontSize: '1.2rem' }} />
                                        <Typography variant="body2" sx={{ fontWeight: '500' }}>{point}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Grid>

                        {/* 이미지 영역 */}
                        <Grid size={{ xs: 12, md: 6 }} >
                            <Box
                                component="img"
                                src={feature.img}
                                alt={feature.title}
                                sx={{
                                    width: '100%',
                                    borderRadius: '24px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                    display: 'block'
                                }}
                            />
                        </Grid>
                    </Grid>
                ))
                }
            </Container >
        </Box >
    );
}