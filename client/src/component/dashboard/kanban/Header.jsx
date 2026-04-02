import { Box, Stack, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { useProjectStore } from "../../../store/useProjectStore.js";
import { useEffect } from "react";
import { useSearchStore } from "../../../store/useSearchStore.js";

export default function Header() {
    const projects = useProjectStore(state => state.projects)

    const searchQuery = useSearchStore(state => state.searchQuery)
    const setSearchQuery = useSearchStore(state => state.setSearchQuery)


    return (
        // #eee를 rgb로 변환한 값: 238,238,238
        <Box sx={{ width: '100%', height: '100%' }}>
            <Stack direction='row' alignItems='center' justifyContent='center' sx={{ height: '100%', px: 2 }}>
                <TextField
                    size="small"
                    placeholder="Search projects..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        width: '500px',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', // 헤더가 딥 그린일 경우 살짝 투명하게
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-root': {
                            color: 'white', // 글자색
                            '& fieldset': { border: 'none' }, // 테두리 제거 (선택 사항)
                            '&:hover fieldset': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)', // 플레이스홀더 색상
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                </InputAdornment>
                            ),
                        }
                    }}
                />
            </Stack>

            <Stack>

            </Stack>

        </Box>

    )
}