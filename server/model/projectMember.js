import mongoose from 'mongoose'

const Schema = mongoose.Schema

const projectMemberSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['LEADER', 'MEMBER'],
    }
})

export default mongoose.model('ProjectMember', projectMemberSchema)