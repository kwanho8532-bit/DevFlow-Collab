import { Box } from "@mui/material";
import WorkspaceArchive from "./WorkspaceArchive.jsx";
import { useAuthStore } from "../../../../store/useAuthStore.js";
import { useEffect } from "react";


export default function WorkspaceArchivePage() {
    const initCsrf = useAuthStore(state => state.initCsrf)

    useEffect(() => {
        async function refresh() {
            await initCsrf()
        }
        refresh()
    }, [initCsrf])
    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            minHeight: 0, // 자식 크기에 따라 부모의 높이가 길어지는 것을 방지
            pb: 1, // 하단 여백
            pr: 1
        }}>
            <WorkspaceArchive />
        </Box>
    )
}