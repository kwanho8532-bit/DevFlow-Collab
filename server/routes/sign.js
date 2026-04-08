import express from 'express'
import * as signController from '../controllers/sign.js'
import upload from '../middleware/multer.js'
// multer.js라는 미들웨어 파일을 만들어서 import해야함
// multer관련 기본 설정은 공부를 해야함 지금은 그냥 
// const upload = multer({dest: 'upload/'})
// 이것밖에 할 줄 모름
import rateLimit from 'express-rate-limit'

const postLimiter = rateLimit({
    windowMs: 1000 * 60 * 5,
    limit: 5,
    handler: (req, res) => {
        res.status(429).json({
            message: '로그인 시도가 너무 많습니다. 5분 뒤에 다시 시도하세요.'
        })
    }
})

const router = express.Router()

router.post('/signup', upload.single('profileImg'), signController.signup)

router.post('/signin', postLimiter, signController.signin)

router.post('/signout', signController.signout)

export default router
