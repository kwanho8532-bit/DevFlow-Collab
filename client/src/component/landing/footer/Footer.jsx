import { Box, Container, Grid, Typography, Link, Stack, IconButton, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

export default function Footer() {
    const handleScroll = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1a1a1a', // 짙은 무채색으로 차분하게 마무리
                color: '#ccc',
                py: 8,
                borderTop: '1px solid #333'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">

                    {/* 브랜드 섹션 */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                            DevFlow
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 2 }}>
                            협업은 단순하게, 결과는 완벽하게.<br />
                            팀의 생산성을 극대화하는 가장 직관적인 워크플로우 툴.
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                            <IconButton size="small" sx={{ color: '#ccc', '&:hover': { color: 'white' } }}>
                                <GitHubIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#ccc', '&:hover': { color: 'white' } }}>
                                <EmailIcon />
                            </IconButton>
                        </Stack>
                    </Grid>

                    {/* 링크 섹션 1 */}
                    <Grid size={{ xs: 6, md: 2 }} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                            Product
                        </Typography>
                        <Stack spacing={1}>
                            <Button onClick={() => handleScroll('core-value')} underline="none" color="inherit" sx={{ '&:hover': { color: 'white' } }}>핵심 기능</Button>
                            <Button onClick={() => handleScroll('feature-detail')} underline="none" color="inherit" sx={{ '&:hover': { color: 'white' } }}>상세 설명</Button>
                        </Stack>
                    </Grid>

                    {/* 링크 섹션 2 */}
                    <Grid size={{ xs: 6, md: 2 }} sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                            Support
                        </Typography>
                        <Stack spacing={1}>
                            <Button underline="none" color="inherit" sx={{ '&:hover': { color: 'white' } }}>피드백 남기기</Button>
                            <Button underline="none" color="inherit" sx={{ '&:hover': { color: 'white' } }}>이용약관</Button>
                        </Stack>
                    </Grid>

                    {/* 하단 저작권 정보 */}
                    <Grid size={{ xs: 12 }} sx={{ mt: 6, pt: 4, borderTop: '1px solid #333', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>
                            © {new Date().getFullYear()} DevFlow. All rights reserved. <br />
                            여러분의 피드백과 함께 성장하고 있습니다.
                        </Typography>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
};