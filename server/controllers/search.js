import { findUsersByQuery } from "../services/search.js";
import catchAsync from "../utils/catchAsync.js";


export const search = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const myId = req.user._id
    const { q } = req.query

    const users = await findUsersByQuery(q, myId)

    res.status(200).json(users)
})