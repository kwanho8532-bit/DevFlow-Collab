import { Box, Typography } from "@mui/material";
import { useProjectStore } from "../../../../store/useProjectStore";
import Loader from "../../../etc/Loader";
import Project from "../project/Project";


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