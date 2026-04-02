import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import MiddleNav from "./middleNav/MiddleNav";
import { Outlet, useParams } from "react-router-dom";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import { useProjectStore } from "../../store/useProjectStore";


export default function WorkspacePage() {
    const { id } = useParams()
    const [isNavOpen, setIsNavOpen] = useState(true)
    const getSelectedWorkspace = useWorkspaceStore(state => state.getSelectedWorkspace)
    const getProjectsInWorkspace = useProjectStore(state => state.getProjectsInWorkspace)

    useEffect(() => {
        getSelectedWorkspace(id)
        getProjectsInWorkspace(id)
    }, [getSelectedWorkspace, id])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '100vh',
            overflow: 'hidden'
        }}>

            {/* sidebar */}
            <Box sx={{
                width: 70,
                display: 'flex',
                bgcolor: '#4C1D95',
            }}>
                <Sidebar
                    isNavOpen={isNavOpen}
                    setIsNavOpen={setIsNavOpen}
                />
            </Box>

            {/* middle nav */}
            <Box sx={{
                width: isNavOpen ? 200 : 0,
                display: 'flex',
                bgcolor: '#4C1D95'
            }}>
                <MiddleNav />
            </Box>

            {/* mainBoard */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#4C1D95',
                minHeight: 0
            }}>
                <Outlet />
            </Box>
        </Box>
    )
}