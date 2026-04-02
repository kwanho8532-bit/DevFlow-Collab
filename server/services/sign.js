import cloudinary from "../cloudinary/cloudinary.js"
import User from "../model/user.js"
import { uploadToCloudinary } from "./uploadToCloudinary.js"

export const register = async ({ username, email, password }, profileImg) => {
    const user = new User({ username, email, profileImg })
    const newUser = await User.register(user, password)
    return newUser
}

export const uploadProfileImage = async (imageBuffer) => {
    const result = await uploadToCloudinary(imageBuffer)
    return { profileImg: result.secure_url, publicId: result.public_id }
}

export const deleteFromCloudinary = async (publicId) => {
    try {
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
            console.log('Cloudinary 이미지 삭제 완료: ', publicId)
        }
    } catch (err) {
        console.error('Cloudinary 이미지 삭제 실패: ', err)
    }
}
