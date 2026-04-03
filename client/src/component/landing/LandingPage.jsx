import {
    Box, Hero,
} from '@mui/material';

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