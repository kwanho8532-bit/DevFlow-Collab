import { Box, Container, Typography, Button, Paper, Stack, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite'; // 하트 아이콘으로 진심 표현
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Link } from 'react-router';

export default function CallToAction() {
    return (
        <Container maxWidth="md" sx={{ pb: 15 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 6, md: 10 },
                    borderRadius: '40px',
                    bgcolor: '#ffffff', // 흰 바탕
                    border: '2px solid', // 테두리 추가
                    borderColor: 'primary.main', // 테두리를 primary.main으로
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 20px 60px rgba(25, 118, 210, 0.12)', // 부드러운 호버 그림자
                    }
                }}
            >
                <Stack spacing={4} alignItems="center">
                    {/* 베타 안내 칩 */}
                    <Chip
                        label="BETA VERSION OPEN"
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 1
                        }}
                    />

                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: '800', color: 'primary.main', mb: 2, wordBreak: 'keep-all' }}>
                            DevFlow는 여러분의 <br /> 피드백을 먹고 자라납니다
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: '500', maxWidth: '600px', mx: 'auto', lineHeight: 1.6, wordBreak: 'keep-all' }}>
                            현재 모든 기능을 무료로 개방하고 있습니다. <br />
                            완성된 서비스가 아닌, "함께 만들어가는 서비스"가 되고 싶습니다.
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', justifyContent: 'center' }}>
                        <Button
                            component={Link}
                            to='/signup'
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                px: 5,
                                py: 2,
                                borderRadius: '16px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' }
                            }}
                        >
                            지금 무료로 시작하기
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<ChatBubbleOutlineIcon />}
                            sx={{
                                color: 'primary.main',
                                borderColor: 'primary.main',
                                borderWidth: '2px',
                                px: 5,
                                py: 2,
                                borderRadius: '16px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                '&:hover': {
                                    borderWidth: '2px',
                                    bgcolor: 'rgba(25, 118, 210, 0.04)'
                                }
                            }}
                        >
                            의견 보내기
                        </Button>
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', pt: 2 }}>
                        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: '600' }}>
                            더 나은 협업 환경, 여러분의 목소리로 완성됩니다.
                        </Typography>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
};