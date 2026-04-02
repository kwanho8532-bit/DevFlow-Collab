import Message from "../model/message.js";
import { saveNewChat, findChatRoomsById, saveNewMessage, getMsg, updateRead } from "../services/chat.js";
import catchAsync from "../utils/catchAsync.js";

export const getChatRooms = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const userId = req.user._id

    const chatRooms = await findChatRoomsById(userId)

    const result = await Promise.all(chatRooms.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
            chatRoom: chat._id,
            sender: { $ne: req.user._id }, // 내가 보낸 건 카운트에서 제외
            isRead: false // 읽지 않은 것만
        })

        return {
            ...chat.toObject(), // mongoose document를 순수 js 객체로 변환시킴
            unread: unreadCount,
        }
    }))

    res.status(200).json(result)
})

export const createChatRoom = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { target } = req.body
    const user = req.user

    const newChatRoom = await saveNewChat(target, user)

    res.status(200).json(newChatRoom)
})

export const createMessage = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { chatId } = req.params
    const { message } = req.body
    const userId = req.user._id

    const newMessage = await saveNewMessage(chatId, message, userId)

    res.status(200).json(newMessage)
})

export const getMessages = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { chatId } = req.params

    const messages = await getMsg(chatId)

    res.status(200).json(messages)
})

export const patchRead = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { chatId } = req.params
    const result = await updateRead(chatId, req.user._id)

    if (result.modifiedCount > 0) {
        // 실제로 메시지가 읽음 처리되었을 때만 추가 로직 실행
        console.log(`${result.modifiedCount}개의 메시지가 읽음 처리되었습니다.`);
    }

    res.status(200).json({
        success: true,
        modifiedCount: result.modifiedCount
    })
})