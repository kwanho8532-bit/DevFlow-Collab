import Workspace from "../model/workspace.js"
import Invite from '../model/invite.js'
import mongoose from "mongoose"
import WorkspaceMember from "../model/workspaceMember.js"

export const findAllWorkspaces = async () => {
    const workspaces = await Workspace.find()
    return workspaces
}

export const findMyWorkspaces = async (userId) => {
    return await WorkspaceMember.find({
        user: userId
    }).populate('workspace')
}

export const findWorkspaceById = async (id) => {
    const workspace = await Workspace.findById(id)
    return workspace
}

export const findWorkspaceMember = async (workspaceId) => {
    const workspaceMember = await WorkspaceMember.find({
        workspace: workspaceId
    }).populate('user')
    return workspaceMember
}

export const create = async (owner, workspaceName, session) => {
    const workspace = await Workspace.create([{
        workspaceName,
        owner,
        createAt: Date.now(),
    }], { session })
    return workspace
}

export const createWorkspaceMember = async (workspaceId, userId, session) => {
    const workspaceMember = await WorkspaceMember.create([{
        workspace: workspaceId,
        user: userId,
        inviteBy: null,
        role: 'OWNER'
    }], { session })
    return workspaceMember
}

export const processWorkspaceCreation = async (userId, workspaceName) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const newWorkspace = await create(userId, workspaceName, session)

        if (!newWorkspace) {
            throw new Error('workspace 생성에 실패하였습니다.')
        }

        console.log(newWorkspace, 'newWorkspace')

        const workspaceMember = await createWorkspaceMember(newWorkspace[0]._id, userId, session)

        await session.commitTransaction()

        return newWorkspace
    } catch (err) {
        await session.abortTransaction()
        console.error("트랜잭션 에러:", err);
        throw err
    } finally {
        await session.endSession()
    }
}

// ACCEPTED 상태 변경 함수
export const findInviteAndUpdate = async (inviteId, session) => {
    return await Invite.findByIdAndUpdate(
        inviteId,
        { status: 'ACCEPTED' },
        { session, returnDocument: 'after' }
    ).populate('invitor invitee workspace')
}

// workspaceMember 생성 함수(join)
export const join = async (workspaceId, inviteeId, invitorId, session) => {
    const [newMember] = await WorkspaceMember.create([{
        workspace: workspaceId,
        user: inviteeId,
        role: 'MEMBER',
        inviteBy: invitorId,
    }], { session })

    await newMember.populate('user workspace')
    return newMember
}

// transaction 관리자 함수
export const processInviteAcceptance = async (inviteId) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const acceptResult = await findInviteAndUpdate(inviteId, session)

        if (!acceptResult) {
            throw new Error('해당 초대를 찾을 수 없습니다.')
        }

        const joinResult = await join(
            acceptResult.workspace._id,
            acceptResult.invitee._id,
            acceptResult.invitor._id,
            session
        )

        await session.commitTransaction()

        return {
            invite: acceptResult,
            newWorkspaceMember: joinResult.user,
            workspace: joinResult.workspace
        }
    } catch (err) {
        await session.abortTransaction()
        console.error("트랜잭션 에러:", err);
        throw err; // 에러를 다시 던져서 Controller가 알 수 있게 해야 함
    } finally {
        await session.endSession()
    }
}

