import Box from '@mui/material/Box';
import Hero from './hero/Hero';
import Description from './description/Description';
import Footer from './footer/footer';

export default function LandingPage() {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Hero />
            <Description />
            <Footer />
        </Box >
    )
}