import mongoose from "mongoose";

const Schema = mongoose.Schema

const messageSchema = new Schema({
    chatRoom: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

messageSchema.index({ chatRoom: 1, createAt: -1 })

messageSchema.post('save', async function (doc) {
    try {
        const Chat = doc.model('Chat')

        await Chat.findByIdAndUpdate(doc.chatRoom, {
            lastMessage: doc._id,
        }, { timestamps: true })

        console.log('lastMessage 업데이트 완료!');
    } catch (err) {
        console.error('Post save hook error:', err);
        throw err
    }
})

export default mongoose.model('Message', messageSchema)