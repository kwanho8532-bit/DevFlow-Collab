import passport from "passport"
import * as signService from "../services/sign.js"
// ../services/sign.js에서 export로 내보낸 모든(*)것들을 다 가져오는데
// 별칭(as)을 signService로 설정한다는 의미이다.
import { generateCsrfToken } from '../config/csrf.js'

import catchAsync from "../utils/catchAsync.js"

export const signup = catchAsync(async function (req, res, next) {
    let uploadedPublicId = null

    try {
        if (!req.file) {
            return res.status(400).json({
                message: '프로필 사진이 없습니다.',
                action: 'RETRY'
            })
        }

        const imageBuffer = req.file.buffer
        const { profileImg, publicId } = await signService.uploadProfileImage(imageBuffer)

        uploadedPublicId = publicId

        const newUser = await signService.register(req.body, profileImg)

        req.login(newUser, (err) => {
            if (err) return next(err)
            res.status(201).json({
                user: {
                    username: newUser.username,
                    email: newUser.email,
                    profileImg: newUser.profileImg
                },
                action: 'REDIRECT'
            })
        })
    } catch (err) {
        // cloudinary에 업로드 이후 로직(로그인 등)에서 에러 시 업로드 된 이미지 삭제
        if (uploadedPublicId) {
            await signService.deleteFromCloudinary(uploadedPublicId)
        }
        next(err)
    }
})
// 뭔가 "로그인이 필요합니다." 와 "인증 정보가 만료되었습니다."가 서로 바뀐것같은데 이거 개선하고
// task 라우터로 분리하기 (router, controller, service)
// cloudinary와 multer(memoryStorage) 다시 복습하기
export const signin = catchAsync(async function (req, res, next) {
    // console.log('--- 신규 요청 발생 ---');
    // console.log('1. 결정된 IP (req.ip):', req.ip);
    // console.log('2. 프록시 헤더 (x-forwarded-for):', req.headers['x-forwarded-for']);
    // console.log('3. 유저 에이전트:', req.headers['user-agent']);
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)

        if (!user) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
        }

        req.login(user, (err) => {
            if (err) next(err)

            // 인증 성공 시 토큰 생성 (쿠키는 자동 발급)
            const csrfToken = generateCsrfToken(req, res)

            return res.status(200).json({
                user,
                message: '로그인 성공',
                action: 'REDIRECT',
                csrfToken
            })
        })
    })(req, res, next)
})

export const signout = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({
            user: null,
            action: 'REDIRECT'
        })
    }
    req.logout(err => {
        if (err) return next(err)

        // 1. 세션 파괴 (로그인 정보 삭제)
        req.session.destroy(err => {
            if (err) return next(err)

            // 2. 세션 쿠키 삭제 (Express 기본 세션 사용 시)
            res.clearCookie('DevFlow.sid', {
                path: '/',
                httpOnly: true
            })

            // 3. CSRF 쿠키 삭제 (중요!)
            // config에서 설정한 cookieName과 동일한 이름을 사용해야 합니다.
            res.clearCookie('__Secure-x-csrf-token', {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })

            return res.status(200).json({
                user: null,
                action: 'REDIRECT'
            })
        })
    })
})
