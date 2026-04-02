import Box from "@mui/material/Box";
import Nav from "./Nav";
import Intro from "./Intro";

export default function Hero() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
                    url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover'
            }}
        >
            <Nav />

            <Intro />

        </Box>
    )
}