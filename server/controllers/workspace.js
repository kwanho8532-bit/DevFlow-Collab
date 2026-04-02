import mongoose from "mongoose";
import { create, createWorkspaceMember, findAllWorkspaces, findInviteAndUpdate, findMyWorkspaces, findWorkspaceById, findWorkspaceMember, processInviteAcceptance, processWorkspaceCreation } from "../services/workspace.js";
import catchAsync from "../utils/catchAsync.js";


export const getAllWorkspaces = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const workspaces = await findAllWorkspaces()

    res.status(200).json(workspaces)
})

export const getMyWorkspaces = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const userId = req.user._id
    const myWorkspaces = await findMyWorkspaces(userId)

    const sendData = myWorkspaces.map(wm => wm.workspace)

    res.status(200).json(sendData)
})

export const getSelectedWorkspace = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { workspaceId } = req.params

    const workspace = await findWorkspaceById(workspaceId)

    res.status(200).json(workspace)
})

export const getWorkspaceMember = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { workspaceId } = req.params
    const workspaceMember = await findWorkspaceMember(workspaceId)
    const sendData = workspaceMember.map(wm => wm.user)
    console.log(sendData)

    return res.status(200).json(sendData)
})

export const createWorkspace = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const userId = req.user._id
    const { workspaceName } = req.body
    // 이것도 processInviteAcceptance처럼 하나의 서비스함수로 묶고,
    // 해당 함수 내부에서 transaction을 활용해서 하나로 묶어서 처리하기
    const result = await processWorkspaceCreation(userId, workspaceName)

    res.status(200).json(result[0])
})

export const acceptAndJoin = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    try {
        const { inviteId } = req.params

        const result = await processInviteAcceptance(inviteId)


        res.status(200).json(result)
    } catch (err) {
        console.log(err)

        // res.status(err.status).json(~~~) 이런식으로 
        // service에서 던진 err을 받아서 작성해야됨
    }
})