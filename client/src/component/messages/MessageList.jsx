import {
    Avatar, Box, Collapse,
    Divider, IconButton, InputBase,
    List, ListItem, ListItemAvatar,
    ListItemButton, ListItemText, Paper,
    Stack, Typography
} from "@mui/material"

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import api from "../api/axios.js";
import { useChatStore } from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";

import dayjs from 'dayjs';

export default function MessageList({ userList, setUserList }) {
    const [searchQ, setSearchQ] = useState('')

    const selectedChatRoom = useChatStore(state => state.selectedChatRoom)
    const chatRooms = useChatStore(state => state.chatRooms)
    const createChatRoom = useChatStore(state => state.createChatRoom)
    const setSelectedRoom = useChatStore(state => state.setSelectedRoom)
    const getChatRooms = useChatStore(state => state.getChatRooms)
    const patchRead = useChatStore(state => state.patchRead)
    const auth = useAuthStore(state => state.auth)

    const controllerRef = useRef(null)

    const debounceAxios = useMemo(() => {
        return debounce(async (query) => {
            if (query.trim().length < 2) return

            if (controllerRef.current) {
                controllerRef.current.abort()
            }

            const controller = new AbortController()
            controllerRef.current = controller

            try {
                const { data } = await api.get(`/user/search?q=${query}`, { signal: controller.signal })
                setUserList(data)
            } catch (err) {
                // 취소된 요청으로 인한 에러 무시
                if (err.name === 'CanceledError') return
            }
        }, 500)
    }, [])

    useEffect(() => {
        if (!selectedChatRoom) return

        async function read() {
            await patchRead(selectedChatRoom._id)
        }
        read()
    }, [selectedChatRoom])

    // useEffect(() => {
    //     async function getChats() {
    //         await getChatRooms()
    //     }
    //     getChats()
    // }, [getChatRooms, selectedChatRoom])

    useEffect(() => {
        return () => {
            debounceAxios.cancel()
            if (controllerRef.current) controllerRef.current.abort()
            setSelectedRoom(null)
        }
    }, [debounceAxios])

    const handleSearch = (value) => {
        setSearchQ(value)
        debounceAxios(value)
    }

    const handleChat = async (target) => {
        try {
            await createChatRoom(target)
        } catch (err) {
            console.log(err)
        } finally {
            setSearchQ('')
        }
    }

    const handleListClick = (chat) => {
        try {
            setSelectedRoom(chat)
            console.log(selectedChatRoom)
        } catch (err) {
            console.log(err)
        }
    }

    console.log(chatRooms)

    return (
        <Paper
            elevation={0}
            sx={{
                flex: 1,
                width: '500px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px', // 훨씬 더 둥글게
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                bgcolor: '#FFF',
                overflow: 'hidden'
            }}
        >
            {/* 구글의 검색창처럼 focus 들어가면 검색 box자체가 흐름에서 제외(뜸)
                    되어서 검색 box에 검색창과 검색결과가 한번에 나오도록 만들기 & 해당 user를 클릭하면
                    왼쪽의 box에 추가하고, 오른쪽의 대화창에 띄우기 */}

            {/* 부드러운 검색바 */}
            <Box sx={{ p: 3, position: 'relative', width: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* 🔵 구글 스타일 통합 컨테이너 */}
                <Paper
                    elevation={searchQ?.length > 0 ? 8 : 0} // 결과가 있을 때만 그림자로 띄움
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        borderRadius: '24px', // 구글 특유의 깊은 곡률
                        bgcolor: searchQ?.length > 0 ? '#FFF' : '#F1F5F9', // 결과 있으면 흰색, 없으면 회색
                        border: '1px solid',
                        borderColor: searchQ?.length > 0 ? 'transparent' : '#E2E8F0',
                        transition: 'all 0.2s ease-in-out',
                        overflow: 'hidden',
                    }}
                >
                    {/* 1. 상단 입력 영역 (항상 고정) */}
                    <Stack direction="row" alignItems="center" sx={{ px: 2.5, py: 1.5 }}>
                        <SearchIcon sx={{ color: '#94A3B8', fontSize: 22 }} />
                        <InputBase
                            onChange={(e) => handleSearch(e.target.value)}
                            fullWidth
                            placeholder="팀원 검색..."
                            value={searchQ}
                            sx={{
                                ml: 1.5,
                                flex: 1,
                                fontSize: 16,
                                fontWeight: 500,
                                '& input': {
                                    width: '100%',
                                    p: 0
                                }
                            }}
                        />
                        {searchQ.length > 0 &&
                            <IconButton onClick={() => setSearchQ('')} >
                                <CloseIcon sx={{ fontSize: 22 }} />
                            </IconButton>
                        }
                    </Stack>

                    {/* 2. 하단 결과 영역 (입력창과 한 몸처럼 움직임) */}
                    <Collapse in={searchQ?.length > 0} timeout="auto">
                        <Box sx={{ pb: 1 }}>
                            <Divider sx={{ mx: 2.5, mb: 1, borderColor: '#F1F5F9' }} />
                            <List sx={{ p: 0, maxHeight: '350px', overflowY: 'auto' }}>
                                {userList?.length > 0 ? (
                                    userList.map((user) => (
                                        <ListItem
                                            key={user._id}
                                            onClick={() => handleChat(user)}
                                            sx={{
                                                px: 3,
                                                py: 1.5,
                                                '&:hover': {
                                                    bgcolor: '#eee',
                                                }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={user.profileImg} sx={{ width: 36, height: 36 }} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.username}
                                                secondary={user.email}
                                                primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
                                                secondaryTypographyProps={{ fontSize: 12 }}
                                            />

                                        </ListItem>
                                    ))
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">검색 결과가 없어요. 🔍</Typography>
                                    </Box>
                                )}
                            </List>
                        </Box>
                    </Collapse>
                </Paper>

            </Box>

            {chatRooms.length > 0 ?
                <List sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, pb: 2 }}>
                    {chatRooms.map((chat) => {
                        const otherUser = chat.participants.find(p => p._id !== auth._id)
                        console.log(otherUser)
                        return (
                            <ListItemButton
                                key={chat._id}
                                onClick={() => handleListClick(chat)}
                                sx={{
                                    borderRadius: '16px', mb: 1, py: 2, px: 2,
                                    transition: 'all 0.2s ease',
                                    bgcolor: selectedChatRoom?._id === chat._id ? '#EFF6FF' : 'transparent',
                                    '&:hover': { bgcolor: '#F6F8FA', transform: 'translateY(-2px)' }
                                }}
                            >

                                <Avatar
                                    src={otherUser.profileImg}
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        bgcolor: '#DBEAFE',
                                        color: '#1E40AF'
                                    }}>
                                    {otherUser.username}
                                </Avatar>

                                <Box sx={{ flexGrow: 1, ml: 2, minWidth: 0 }}>
                                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B' }}>
                                            {otherUser.username}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{
                                        color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        fontWeight: chat.unread > 0 ? 700 : 400
                                    }}>
                                        {chat.lastMessage?.message || '삭제된 메시지입니다.'}
                                    </Typography>
                                </Box>

                                {chat.unread > 0 && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', }}>
                                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                            {/* 이건 dataHelper에 다른 객체 추가해서
                                                오늘 안은 시간으로,어제는 '어제', 그저께부터는 YYYY.MM.DD로 만들기 */}
                                            {dayjs(chat.createdAt).format('YYYY.MM.DD')}
                                        </Typography>
                                        <Box
                                            sx={{
                                                ml: 1,
                                                height: 20,
                                                minWidth: 20, // 👈 숫자가 커져도 원형/타원형을 유지하도록 추가
                                                px: 0.8,      // 👈 숫자가 두 자리가 될 때를 대비해 좌우 패딩 추가
                                                bgcolor: '#3B82F6',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#FFF',
                                                fontSize: 10,
                                                fontWeight: 800,
                                                alignSelf: 'flex-end', // 👈 핵심: 오른쪽으로 붙이면서 너비는 내용물만큼만!
                                            }}>
                                            {chat.unread}
                                        </Box>
                                    </Box>

                                )}
                            </ListItemButton>
                        )
                    })}
                </List>
                :
                <Stack direction='row' justifyContent='center' alignItems='center' sx={{ flex: 1, display: 'flex', }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>
                        팀원을 검색하여 첫 메시지를 보내보세요!
                    </Typography>
                </Stack>
            }
        </Paper>
    )
}