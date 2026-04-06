import { create } from "zustand";
import api from "../component/api/axios.js";

export const useChatStore = create((set, get) => ({
    chatRooms: [],
    messages: [],
    selectedChatRoom: null,
    getChatRooms: async () => {
        try {
            const { data } = await api.get('/chat')
            set({ chatRooms: data })
        } catch (err) {
            console.log(err)
        }
    },
    getMessages: async (chatId) => {
        try {
            const { data } = await api.get(`/chat/${chatId}`,
                { headers: { 'x-skip-loading': 'true' } })
            set({ messages: data })
        } catch (err) {
            console.log(err)
        }
    },
    createChatRoom: async (target) => {
        try {
            const { data } = await api.post('/chat', { target })
            set(state => ({
                selectedChatRoom: data,
                chatRooms: [data, ...state.chatRooms]
            }))
        } catch (err) {
            console.log(err)
        }
    },
    setSelectedRoom: (chatRoom) => {
        set({ selectedChatRoom: chatRoom })
    },
    createMessage: async (chatId, message) => {
        try {
            const { data } = await api.post(`/chat/${chatId}/message`,
                { message },
                { headers: { 'x-skip-loading': 'true' } })

            set(state => ({
                messages: [...state.messages, data],
                chatRooms: state.chatRooms.map(room => {
                    return (room._id === chatId ?
                        { ...room, lastMessage: data, updatedAt: data.createdAt }
                        :
                        room
                    )
                }).sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
            }))
        } catch (err) {
            console.log(err)
        }
    },
    patchRead: async (chatId) => {
        try {
            const { data } = await api.patch(`/chat/${chatId}/read`)
            if (data.success) {
                set(state => ({
                    chatRooms: state.chatRooms.map(room => (
                        room._id === chatId ?
                            { ...room, unread: 0 }
                            :
                            room
                    ))
                }))
            }
        } catch (err) {
            console.log(err)
        }
    }

}))