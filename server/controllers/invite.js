import { create, findUserInvites } from "../services/invite.js";
import catchAsync from "../utils/catchAsync.js";

export const getPendingInvites = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const userId = req.user._id
    const invites = await findUserInvites(userId)

    res.status(200).json(invites)
})

export const createInvite = catchAsync(async function (req, res, next) {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: '로그인이 필요합니다.'
            })
        }

        const invitorId = req.user._id
        const { inviteeId, workspaceId } = req.body

        const invite = await create(invitorId, inviteeId, workspaceId)

        res.status(200).json(invite)
    } catch (err) {
        if (err.code === 11000) {
            res.status(409).json({ message: '이미 초대한 유저입니다.' })
        }
        res.status(500).json({ message: '서버 에러' })
    }
})

