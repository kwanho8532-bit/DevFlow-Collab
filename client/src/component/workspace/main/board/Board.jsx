import { Box } from "@mui/material";

import Project from "../project/Project.jsx";


export default function Board() {
    // main 때문에 scroll 생기지 않도록 만들기
    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '28px',
            bgcolor: '#F9F8F6',
            overflow: 'hidden',
        }}>
            <Project />
        </Box>
    )
}