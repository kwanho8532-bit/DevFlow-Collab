import express from 'express'
import * as signController from '../controllers/sign.js'
import upload from '../middleware/multer.js'
// multer.js라는 미들웨어 파일을 만들어서 import해야함
// multer관련 기본 설정은 공부를 해야함 지금은 그냥 
// const upload = multer({dest: 'upload/'})
// 이것밖에 할 줄 모름

const router = express.Router()

router.post('/signup', upload.single('profileImg'), signController.signup)

router.post('/signin', signController.signin)

router.post('/signout', signController.signout)

export default router
