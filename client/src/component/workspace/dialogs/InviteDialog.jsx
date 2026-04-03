import {
    Avatar, Button, Dialog,
    DialogActions, DialogContent, DialogTitle,
    List, ListItem, ListItemAvatar,
    ListItemText, TextField, Box,
    Typography, InputAdornment, Stack,
    IconButton, Tooltip,

} from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';

import { debounce } from 'lodash'
import { useMemo } from "react";
import api from "../../api/axios.js";
import { useState, useRef, useEffect } from "react";
import { useInviteStore } from "../../../store/useInviteStore.js";
import { useWorkspaceStore } from "../../../store/useWorkspaceStore.js";


export default function InviteDialog({ open, handleClose, findUserList, setFindUserList }) {
    const createInvite = useInviteStore(state => state.createInvite)
    const selectedWorkspace = useWorkspaceStore(state => state.selectedWorkspace)

    const [searchQ, setSearchQ] = useState(null)

    const controllerRef = useRef(null)

    const debounceFetch = useMemo(() => {
        return debounce(async (query) => {
            if (query.trim().length < 2) return

            if (controllerRef.current) {
                controllerRef.current.abort()
            }

            const controller = new AbortController()
            controllerRef.current = controller

            try {
                const { data } = await api.get(`/user/search?q=${query}`, { signal: controller.signal })
                setFindUserList(data)
            } catch (err) {
                // 취소된 요청은 무시 (axios의 경우 abort로 취소된 요청은 CanceledError라는 이름의 에러가 던져짐)
                if (err.name === 'CanceledError') return

                console.log(err)
            }
        }, 500) // 0.5초
    }, [])


    useEffect(() => {
        return () => {
            debounceFetch.cancel()
            if (controllerRef.current) controllerRef.current.abort()
        }
    }, [debounceFetch])

    const handleSearch = (value) => {
        setSearchQ(value)
        debounceFetch(value)
    }

    // 초대를 보내는 onClick함수 작성하기 & 서버 로직 만들기(어떤 모델 사용해야하는가?)
    // invite-box에서 해당 초대 확인해보기 

    const handleInvite = async (targetId) => {
        await createInvite(targetId, selectedWorkspace._id)
    }

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        p: 2,
                        borderRadius: '32px',
                    }
                }
            }}
        >
            <DialogTitle id="alert-dialog-title">
                <Typography component='div' variant="h5" textAlign='center'>
                    Invite
                </Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    maxHeight: '60vh', // 1. 스크롤이 발생할 최대 높이 설정
                    overflowY: 'auto', // 2. 부모에서 스크롤이 일어나야 함
                    p: 2,
                    position: 'relative', // sticky의 기준점 보강
                }}
            >
                <Stack
                    direction='column'
                    spacing={1}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <Box sx={{
                        position: 'sticky',
                        top: 0,           // 3. 최상단에 붙이기
                        zIndex: 10,       // 리스트보다 위로
                        bgcolor: 'background.paper', // 중요: 배경색이 없으면 리스트랑 겹쳐 보임
                    }}>
                        <TextField
                            size="small"
                            placeholder="2자 이상부터 검색 가능합니다."
                            onChange={(e) => handleSearch(e.target.value)}
                            sx={{
                                width: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', // 헤더가 딥 그린일 경우 살짝 투명하게
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '999px',
                                    bgcolor: 'rgba(0,0,0,0.08)',
                                    color: '#000', // 글자색
                                    '& fieldset': { border: 'none' }, // 테두리 제거 (선택 사항)
                                    '&.Mui-focused': {
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                    },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#000', // 플레이스홀더 색상
                                },

                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#000' }} />
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    <List dense sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}>
                        {findUserList?.length !== 0 ?
                            findUserList?.map((user) => {
                                return (
                                    <ListItem
                                        key={user._id}
                                        disablePadding
                                    >
                                        <Stack
                                            direction='row'
                                            justifyContent='space-between'
                                            alignItems='center'
                                            sx={{
                                                p: 1,
                                                width: '100%',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                                            }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt='ex member'
                                                    src={user.profileImg}
                                                    sx={{ width: '30px', height: '30px' }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText primary={
                                                <Stack direction='row' alignItems='center' spacing={2}>
                                                    <Typography variant="body1">
                                                        {user.username}
                                                    </Typography>

                                                    <Typography variant="caption" color='text.secondary'>
                                                        {user.email}
                                                    </Typography>
                                                </Stack>
                                            } />
                                            <Tooltip title='invite'>
                                                <IconButton onClick={() => handleInvite(user._id)}>
                                                    <SendIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </ListItem>
                                );
                            })
                            :
                            <Typography variant="subtitle1" textAlign='center' color='text.secondary'>
                                일치하는 이름의 유저가 없습니다.
                            </Typography>
                        }

                    </List>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center', mt: 3 }} >
                <Button onClick={handleClose}
                    sx={{
                        borderRadius: '999px',
                        bgcolor: '#4c1d95',
                        color: '#fff',
                        fontSize: '0.8rem',
                        px: 2,
                        '&:hover': {
                            bgcolor: '#3a1572'
                        }
                    }}
                >
                    Cancel
                </Button>

            </DialogActions>

        </Dialog >
    )
}