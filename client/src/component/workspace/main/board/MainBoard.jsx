import { Box } from "@mui/material";

import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";


export default function MainBoard() {
    return (
        <Box sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',

        }}>

            {/* header */}
            <Box sx={{
                height: 48,
            }}>
                <Header />
            </Box>

            {/* body */}
            <Box sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                pr: 1,
                pb: 1,
                overflow: 'hidden',
            }}>
                <Outlet />
            </Box>


        </Box>
    )
}