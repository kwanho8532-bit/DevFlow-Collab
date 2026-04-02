import mongoose from "mongoose";

const Schema = mongoose.Schema

const chatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: { // 채팅방 리스트에서 보여주는 마지막 메시지
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    }
}, { timestamps: true })

chatSchema.index({ participants: 1 })

export default mongoose.model('Chat', chatSchema)