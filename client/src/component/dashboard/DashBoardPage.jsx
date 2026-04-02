import { Grid } from "@mui/material";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";


export default function DashBoardPage() {
    return (
        <Grid container sx={{ minHeight: '100vh', bgcolor: '#064E3B' }}>
            <Grid
                size={1}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'ECFDF5',
                }}>
                <Sidebar />
            </Grid>

            <Grid size={11} >
                <Grid container direction='column' sx={{ height: '100%' }}>
                    <Outlet />
                </Grid>
            </Grid>
        </Grid >
    )
}

