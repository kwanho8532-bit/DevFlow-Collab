import Invite from '../model/invite.js'

export const findUserInvites = async (userId) => {
    const invites = await Invite
        .find({ invitee: userId, status: 'PENDING' })
        .populate('invitor invitee workspace')
    return invites
}

export const create = async (invitorId, inviteeId, workspaceId) => {
    const invite = await new Invite({
        invitor: invitorId,
        invitee: inviteeId,
        workspace: workspaceId,
        status: 'PENDING',
    }).save()
    return invite
}

