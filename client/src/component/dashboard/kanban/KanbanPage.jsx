import { Grid } from "@mui/material";

import Header from "./Header";
import Kanban from "./Kanban";

export default function KanbanPage() {
    return (
        <>
            <Grid bgcolor='#064E3B' sx={{ height: '48px' }}>
                <Header />
            </Grid>

            <Grid sx={{
                flex: 1,
                pb: 1, // 하단 여백
                pr: 1, // 오른쪽 여백 (질문하신 부분)
                maxHeight: '100%',
            }}>
                <Kanban />
            </Grid>
        </>
    )
}