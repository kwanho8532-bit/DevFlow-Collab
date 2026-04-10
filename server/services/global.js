import projectMember from "../model/projectMember.js"
import User from "../model/user.js"

export const findCurrUser = async function (targetId) {
    const currUser = await User.findById(targetId)
    return currUser
    // 처음 방문한 유저의 경우 회원가입/로그인 되어있지 않은 것이
    // error는 아니기 때문에 굳이 if로 분기해서 throw하지 않음
}

export const findUserProjects = async function (userId) {
    const userProjects = await projectMember.find({ user: userId })
        .sort({ lastAccessedAt: -1 })
        .populate({
            path: 'project',
            populate: {
                path: 'owner'
            }
        })
        .exec()

    return userProjects
}