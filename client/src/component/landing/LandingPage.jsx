import { Box } from '@mui/material';

import Hero from './hero/Hero.jsx';
import Description from './description/Description.jsx';
import Footer from './footer/Footer.jsx';
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
    return (
        <>
            <Helmet>
                {/* 1. 브라우저 탭 제목 */}
                <title>DevFlow | 스타트업을 위한 가벼운 협업 플랫폼</title>

                {/* 2. 검색 엔진용 설명 (SEO) */}
                <meta
                    name="description"
                    content="스타트업과 소규모 팀을 위한 효율적인 프로젝트 관리 도구 DevFlow. 칸반 보드와 실시간 메시징으로 팀원들과 더 빠르게 소통하고 협업하세요."
                />

                {/* 3. 소셜 미디어 공유 (Open Graph) */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="DevFlow - 가벼운 협업의 시작" />
                <meta
                    property="og:description"
                    content="복잡한 도구는 이제 그만. DevFlow에서 팀 프로젝트를 직관적으로 관리해보세요."
                />
                {/* 실제 로고나 서비스 스크린샷 이미지 URL을 넣으세요 */}
                {/* <meta property="og:image" content="https://devflow.vercel.app/og-main.png" /> */}
                <meta property="og:url" content="https://dev-flow-collab.duckdns.org/landing" />

                {/* 4. 트위터 공유용 */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="DevFlow | 스타트업 협업 플랫폼" />
                <meta name="twitter:description" content="팀원들과 실시간으로 업무를 공유하고 프로젝트를 완성하세요." />

                {/* 5. canonical설정 */}
                <link rel="canonical" href="https://dev-flow-collab.duckdns.org/landing" />

            </Helmet>

            <Box sx={{ minHeight: '100vh' }}>
                <Hero />
                <Description />
                <Footer />
            </Box>
        </>
    )
}