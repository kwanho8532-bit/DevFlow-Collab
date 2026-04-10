import express from 'express'
import * as chatController from '../controllers/chat.js'
import doubleCsrfProtection from '../config/csrf.js'

const router = express.Router()

router.route('/')
    .get(chatController.getChatRooms)
    .post(doubleCsrfProtection, chatController.createChatRoom)

router.get('/:chatId', chatController.getMessages)

router.patch('/:chatId/read', doubleCsrfProtection, chatController.patchRead)

router.post('/:chatId/message', doubleCsrfProtection, chatController.createMessage)

export default router