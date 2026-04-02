import {
    Avatar, Box, IconButton,
    InputBase, Paper, Stack,
    Tooltip,
    Typography
} from "@mui/material";


import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import CloseIcon from '@mui/icons-material/Close';
import { useChatStore } from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";

export default function MessageChat() {
    const selectedChatRoom = useChatStore(state => state.selectedChatRoom)
    const setSelectedRoom = useChatStore(state => state.setSelectedRoom)
    const createMessage = useChatStore(state => state.createMessage)
    const getMessages = useChatStore(state => state.getMessages)
    const messages= useChatStore(state => state.messages)
    const auth = useAuthStore(state => state.auth)

    const [message, setMessage] = useState('')

    const otherUser = selectedChatRoom?.participants.find(p => p._id !== auth._id)

    useEffect(() => {
        if (!selectedChatRoom) return 
        
        async function getMsg () {
            await getMessages(selectedChatRoom._id)
        } 
        getMsg() 
    }, [getMessages, selectedChatRoom])

    const handleMessage = (value) => {
        setMessage(value)
    }

    const handleSend = async (chatId, message) => {
        try {
            console.log(chatId, message, 'front handleSend function')
            await createMessage(chatId, message)
        } catch (err) {
            console.log(err)
        } finally {
            setMessage('')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (e.nativeEvent.isComposing) return

            if (message.trim().length === 0) {
                e.preventDefault()
                setMessage('');
                return
            }

            e.preventDefault()
            handleSend(selectedChatRoom._id, message)
            setMessage('')
        }
    }

    return (
        <Paper
            elevation={0}
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                bgcolor: '#FFF',
                overflow: 'hidden'
            }}
        >
            {!selectedChatRoom ?
                //  ✅ Empty State: 감성적인 비주얼 
                <Stack spacing={3} sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                    <Box sx={{
                        position: 'relative', width: 140, height: 140,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Box sx={{
                            position: 'absolute', width: '100%', height: '100%',
                            bgcolor: '#EEF2FF', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                            animation: 'morph 8s ease-in-out infinite' // 부드러운 움직임 효과
                        }} />
                        <ForumRoundedIcon sx={{ fontSize: 60, color: '#6366F1', zIndex: 1 }} />
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                            소통의 시작
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 340, lineHeight: 1.7 }}>
                            동료를 선택하여 대화를 시작해 보세요.<br />모든 위대한 프로젝트는 작은 대화에서 시작됩니다.
                        </Typography>
                    </Box>
                </Stack>

                :
                //  이건 나중에 message 생성하고 나서 만들기
                //  ✅ Chat UI: 부드러운 대화창 
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={otherUser.profileImg}
                                sx={{
                                    bgcolor: '#F1F5F9',
                                    color: '#1E293B',
                                    fontWeight: 'bold'
                                }}>
                                {otherUser.username}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                    {otherUser.username}
                                </Typography>
                            </Box>
                        </Stack>
                        <Tooltip title='close chat'>
                            <IconButton onClick={() => setSelectedRoom(null)}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* 채팅창 */}
                    <Box sx={{ flex: 1, p: 4, bgcolor: '#F8FAFC', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {messages.map(msg => {
                            console.log(msg)
                            const mine = msg.sender._id === auth._id
                            return (
                                <Stack key={msg._id} direction='row' spacing={1} alignItems='flex-end' sx={{alignSelf: mine? 'flex-end':'flex-start', maxWidth: '70%',}}>
                                    {mine && 
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', flexShrink: 0 }} >
                                            {dayjs(msg?.createdAt).format('A h:mm')}
                                        </Typography>
                                    }
                                    <Box 
                                        sx={{
                                            bgcolor: mine ? '#2563EB' : '#FFFFFF', 
                                            color: mine ? '#FFFFFF' : '#1E293B',
                                            p: '10px 16px', // 패딩을 조금 더 세밀하게 조정
                                            borderRadius: mine 
                                                ? '16px 16px 4px 16px'  // 오른쪽 아래가 뾰족한 모양
                                                : '16px 16px 16px 4px', // 왼쪽 아래가 뾰족한 모양
                                                boxShadow: mine 
                                                ? '0 4px 12px rgba(37, 99, 235, 0.2)' 
                                                : '0 2px 8px rgba(0,0,0,0.05)',
                                            border: mine ? 'none' : '1px solid #F1F5F9',
                                        }}
                                        >
                                        <Stack direction='row'>
                                            <Typography variant="body2" sx={{ lineHeight: 1, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                                {/* 이건 useEffect()로 message를 가져와서 설정 */}
                                                {msg.message}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    {!mine && 
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', flexShrink: 0 }}>
                                            {dayjs(msg?.createdAt).format('A h:mm')}
                                        </Typography>
                                    }
                                </Stack>
                            )
                        })}

                    </Box>

                    <Box sx={{ p: 3, bgcolor: '#FFF' }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', bgcolor: '#F1F5F9',
                            borderRadius: '20px', px: 2.5, py: 1
                        }}>
                            <InputBase
                                value={message}
                                onChange={(e) => handleMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                multiline
                                maxRows={3}
                                placeholder='메시지 입력'
                                sx={{ flex: 1, fontSize: 15 }}
                            />
                            <IconButton
                                disabled={message.trim().length === 0}
                                onClick={() => handleSend(selectedChatRoom._id, message)}
                                sx={{
                                    bgcolor: '#3B82F6',
                                    color: '#FFF',
                                    ml: 1,
                                    '&:hover': { bgcolor: '#2563EB' }
                                }}>
                                <SendRoundedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            }
        </Paper>
    )
}

// <Box
//   sx={{
//     maxWidth: '70%', // 말풍선이 화면의 70% 이상 커지지 않게 제한
//     padding: '10px 14px',
//     borderRadius: '12px',
//     // 핵심 속성들
//     wordBreak: 'break-word', // 긴 단어도 너비에 맞춰 강제로 자름
//     overflowWrap: 'break-word', // 단어 단위로 줄바꿈 시도
//     whiteSpace: 'pre-wrap', // 줄바꿈(\n)과 공백을 유지하면서 자동 줄바꿈 적용
//   }}
// >
//   <Typography variant="body2">
//     {msg.text}
//   </Typography>
// </Box>

// <ListItem
//     sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: isMine ? 'flex-end' : 'flex-start',
//         px: 2, py: 0.5
//     }}
// >
//  말풍선 본체
//   <Box
//     sx={{
//       maxWidth: '75%', 
//       bgcolor: isMine ? '#3B82F6' : '#F1F5F9',
//       color: isMine ? '#fff' : '#1E293B',
//       borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
//       p: 1.5,
//       // 텍스트 래핑 설정
//       wordBreak: 'break-word',
//       whiteSpace: 'pre-wrap',
//       boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
//     }}
//   >
//     <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
//       {msg.text}
//     </Typography>
//   </Box>
  
// //   시간 표시 (말풍선 아래) 
//     <Typography variant="caption" sx={{ mt: 0.5, color: '#94A3B8', fontSize: '0.7rem' }}>
//         {dayjs(msg.createdAt).format('A h:mm')}
//     </Typography>
// </ListItem> 