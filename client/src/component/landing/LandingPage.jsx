import { Box } from '@mui/material';

import Hero from './hero/Hero.jsx';
import Description from './description/Description.jsx';
import Footer from './footer/Footer.jsx';

export default function LandingPage() {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Hero />
            <Description />
            <Footer />
        </Box >
    )
}