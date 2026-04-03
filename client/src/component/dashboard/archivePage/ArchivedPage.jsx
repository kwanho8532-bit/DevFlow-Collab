import { Grid } from "@mui/material";
import Archvied from "./Archived.jsx";

export default function ArchivedPage() {
    return (

        <Grid sx={{
            flex: 1,
            pt: 3,
            pb: 1, // 하단 여백
            pr: 1, // 오른쪽 여백 (질문하신 부분)
            maxHeight: '100%',
        }}>
            <Archvied />
        </Grid>
    )
}