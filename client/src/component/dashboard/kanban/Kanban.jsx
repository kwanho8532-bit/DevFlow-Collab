import {
    Box, Button, Grid,
    Stack, Typography,
} from "@mui/material";

import KanbanCoulmn from "./KanbanColumn.jsx";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { useProjectStore } from "../../../store/useProjectStore.js";
import hangul from "hangul-js";
import { useSearchStore } from "../../../store/useSearchStore.js";
import { useMemo } from "react";


export default function Kanban() {
    const auth = useAuthStore(state => state.auth, shallow)
    const projects = useProjectStore(state => state.projects)
    const searchQuery = useSearchStore(state => state.searchQuery)

    // archived가 아니면서 searchQuery 시 부합하는 프로젝트 필터
    const filterBase = useMemo(() => {
        if (!projects) return []

        return projects.filter(pm => {
            const isNotArchived = !pm.project.archivedAt

            const isMatch = searchQuery ?
                hangul.search(pm.project.projectName, searchQuery) >= 0
                : true // searchQuery가 없을 경우 모든 항목 통과를 위해 true를 줌

            // filter()의 동작원리에 따라 return true가 반환되면 현재 돌고있는
            // 항목을 결과 바구니에 담게된다.
            return isNotArchived && isMatch
        })
    }, [projects, searchQuery])

    // column으로 넘기는 로직


    return (
        <Box
            sx={{
                width: '100%',
                height: 'calc(100vh - 48px)',
                bgcolor: '#F9F8F6', // 메인 화이트 계열
                borderRadius: '24px', // 모든 모서리를 둥글게 하거나 상황에 맞춰 조절
                boxShadow: '0px 4px 20px rgba(0,0,0,0.15)', // 떠 있는 느낌을 위한 그림자
                p: 3,
                overflow: 'hidden',
                overflowX: 'auto'
            }}
        >
            {auth ?
                <Grid container justifyContent='center' spacing={3} sx={{ p: 3, mt: 3, height: '100%' }}>
                    <KanbanCoulmn title='Planning' projects={filterBase.filter(p => p.project.status === 'PLANNING')} />
                    <KanbanCoulmn title='In Progress' projects={filterBase.filter(p => p.project.status === 'IN_PROGRESS')} />
                    <KanbanCoulmn title='Done' projects={filterBase.filter(p => p.project.status === 'DONE')} />
                </Grid>
                :
                <Stack direction='column' alignItems='center' spacing={2} sx={{ mt: 10 }}>
                    <Typography variant="h5" textAlign='center' sx={{ fontWeight: '700' }}>
                        인증 정보가 만료되었습니다.
                    </Typography>
                    <Typography variant="subtitle1" textAlign='center' sx={{ fontWeight: '700' }}>
                        다시 로그인해주십시오.
                    </Typography>
                    <Button
                        component={Link}
                        to='/signin'
                        variant="contained"
                        sx={{
                            borderRadius: '999px',
                            bgcolor: '#1E3A8A'
                        }}>
                        sign in
                    </Button>
                </Stack>
            }

        </Box >
    )
}