import Chat from "../model/chat.js"
import Message from "../model/message.js"

export const findChatRoomsById = async (userId) => {
    const chatRooms = await Chat.find({
        participants: { $in: userId }
    }).populate('participants lastMessage')
    return chatRooms
}

export const saveNewChat = async (target, user) => {
    const newChatRoom = await Chat.create({
        participants: [target._id, user._id],
        lastMessage: null
    })
    return await newChatRoom.populate({
        path: 'participants',
        select: 'username profileImg _id'
    })
}

export const saveNewMessage = async (chatId, message, userId) => {
    const newMessage = await Message.create({
        chatRoom: chatId,
        message,
        sender: userId,
        isRead: false
    })
    return newMessage.populate('chatRoom sender')
}

export const getMsg = async (chatId) => {
    const messages = await Message
        .find({ chatRoom: chatId })
        .populate('chatRoom sender')
        .sort({ createAt: -1 })
    console.log(messages)
    return messages
}

export const updateRead = async (chatId, myId) => {
    return await Message.updateMany(
        {
            chatRoom: chatId,
            sender: { $ne: myId },
            isRead: false
        },
        { $set: { isRead: true } },
    )
}