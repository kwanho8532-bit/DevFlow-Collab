import { findCurrUser, findUserProjects } from "../services/global.js"
import catchAsync from "../utils/catchAsync.js"
import { generateCsrfToken } from '../config/csrf.js'

export const auth = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(200).json({ user: null })
    }

    const currUser = await findCurrUser(req.user._id)

    if (!currUser) {
        return res.status(404).json({
            user: null,
            message: '유저를 찾을 수 없습니다.'
        })
    }

    res.status(200).json({ user: currUser })
})

export const checkAuth = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ user: null })
    }

    const user = req.user

    return res.status(200).json(user)
})

export const currProject = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const currUser = req.user

    if (currUser) {
        const userProjects = await findUserProjects(currUser._id)
        const sendData = userProjects.filter(pm => !pm.project.workspace)
        res.status(200).json(sendData)
    } else {
        res.status(200).json(null)
    }

})

export const csrfToken = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const csrfToken = generateCsrfToken(req, res)

    res.status(200).json(csrfToken)

})