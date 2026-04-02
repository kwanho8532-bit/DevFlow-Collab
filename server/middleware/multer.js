import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('이미지 파일만 업로드 가능합니다!'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB 용량 제한
})

export default upload

// mimetype은 파일의 형식을 문자열로 표현한 것이다.
// image/png, image/jpeg 등 mimetype은 type과 subtype으로 나뉘고 /로 구분한다.

// 옆에 multer 기본 설정 코드(제미나이) 보고 기본설정 공부하고
// router, controller, service 등을 만들기 & app.js의 다른 라우터들도
// router controller, service로 분리하여 정상 동작하도록 만들기