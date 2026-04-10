import { Grid } from "@mui/material";

import Header from "./Header.jsx";
import Kanban from "./Kanban.jsx";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore.js";

export default function KanbanPage() {
    const initCsrf = useAuthStore(state => state.initCsrf)

    useEffect(() => {
        async function refresh() {
            await initCsrf()
        }
        refresh()
    }, [initCsrf])
    return (
        <>
            <Helmet>

            </Helmet>

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