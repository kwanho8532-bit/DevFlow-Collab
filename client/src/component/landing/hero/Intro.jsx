import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

import { Link } from 'react-router'

export default function Intro() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Box sx={{ bgcolor: `rgba(0,0,0,0.6)`, p: 4, borderRadius: '30px' }}>
                <Typography variant="h4" textAlign='center' sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                    협업은 단순하게, 결과는 완벽하게.
                </Typography>
                <Typography variant="h6" textAlign='center' sx={{ color: '#ccc', mb: 4 }}>
                    더 이상 협업 툴 공부에 시간을 낭비하지 마세요. <br />
                    DevFlow는 우리 팀이 오늘 당장 해야 할 일에만 집중할 수 있는 최적의 환경을 제공합니다.
                </Typography>
                <Stack spacing={2} direction='row' justifyContent='center'>
                    <Button component={Link} to='/signup' sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '18px' }}>
                        <RocketLaunchIcon sx={{ mr: 1, color: "white" }} />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                            지금 무료로 시작하기
                        </Typography>
                    </Button>
                    <Button component={Link} to='/signin' sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '18px' }}>
                        <PermIdentityIcon sx={{ mr: 1, color: "white" }} />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                            이미 계정이 있으신가요?
                        </Typography>
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
}