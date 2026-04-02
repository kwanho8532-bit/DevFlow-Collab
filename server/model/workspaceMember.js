import mongoose from 'mongoose'

const Schema = mongoose.Schema

const workspaceMemberSchema = new Schema({
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        enum: ['OWNER', 'MEMBER'],
        default: 'MEMBER',
    },
    inviteBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
})

export default mongoose.model('WorkspaceMember', workspaceMemberSchema)