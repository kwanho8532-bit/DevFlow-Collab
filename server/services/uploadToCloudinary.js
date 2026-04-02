import cloudinary from "../cloudinary/cloudinary.js"
import fs from 'fs'

// diskStorage 사용 시의 미들웨어

// export function uploadToCloudinary(imagePath) {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             { folder: 'DevFlow' },
//             async (err, result) => {
//                 try {
//                     if (fs.existsSync(imagePath)) {
//                         await fs.promises.unlink(imagePath)
//                     }
//                 } catch (unlinkError) {
//                     console.error('파일 삭제 중 오류 발생: ', unlinkError)
//                     return reject(new Error('파일 삭제 도중 에러 발생(unlink)'))
//                 }
//                 if (err) return reject(err)
//                 resolve(result)
//             }
//         )
//         const fileStream = fs.createReadStream(imagePath)
//         fileStream.on('error', (err) => {
//             reject(err)
//         })
//         fileStream.pipe(uploadStream)
//     })
// }

// memortStorage 사용 시 미들웨어

export function uploadToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'DevFlow' },
            (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }
        )
        uploadStream.end(buffer)
        // buffer 데이터를 stream에 전달
        // → 업로드 시작
        // → 스트림 종료
    })
}
