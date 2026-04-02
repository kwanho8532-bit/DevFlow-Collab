import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLoadingStore } from '../../store/useLoadingStore.js';

export default function Spinner({ content }) {
    const isLoading = useLoadingStore(state => state.isLoading)

    if (!isLoading) return null

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
        >
            <Stack direction='column' alignItems='center' spacing={2}>
                <CircularProgress color="inherit" />
                <Typography variant='body1'>
                    {content}...
                </Typography>
            </Stack>
        </Backdrop>
    );
}