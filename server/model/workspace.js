import mongoose from 'mongoose'

const Schema = mongoose.Schema

const workspaceSchema = new Schema({
    workspaceName: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
})

export default mongoose.model('Workspace', workspaceSchema)