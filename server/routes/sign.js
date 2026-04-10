import express from 'express'
import * as signController from '../controllers/sign.js'
import upload from '../middleware/multer.js'
// multer.js라는 미들웨어 파일을 만들어서 import해야함
// multer관련 기본 설정은 공부를 해야함 지금은 그냥 
// const upload = multer({dest: 'upload/'})
// 이것밖에 할 줄 모름
import { postLimiter } from '../middleware/rateLimit.js'
import { doubleCsrfProtection } from '../config/csrf.js'

const router = express.Router()

router.post('/signup', doubleCsrfProtection, upload.single('profileImg'), signController.signup)

router.post('/signin', postLimiter, doubleCsrfProtection, signController.signin)

router.post('/signout', doubleCsrfProtection, signController.signout)

export default router
