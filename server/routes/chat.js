import express from 'express'
import * as chatController from '../controllers/chat.js'

const router = express.Router()

router.route('/')
    .get(chatController.getChatRooms)
    .post(chatController.createChatRoom)

router.get('/:chatId', chatController.getMessages)

router.patch('/:chatId/read', chatController.patchRead)

router.post('/:chatId/message', chatController.createMessage)

export default router