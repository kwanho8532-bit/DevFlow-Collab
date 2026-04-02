import mongoose from 'mongoose'

const Schema = mongoose.Schema

const inviteSchema = new Schema({
    invitor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    invitee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
        default: 'PENDING'
    }
}, { timestamps: true })

// 핵심은 "두 필드를 묶어서 하나의 키처럼 취급" 한다는 것
inviteSchema.index({ invitee: 1, workspace: 1 }, { unique: true })

// 1. 숫자의 의미: 오름차순 vs 내림차순
// 1 (오름차순, Ascending): 작은 값에서 큰 값 순서로 정렬합니다. (예: 1, 2, 3... 또는 A, B, C...)

// -1 (내림차순, Descending): 큰 값에서 작은 값 순서로 정렬합니다. (예: 10, 9, 8... 또는 Z, Y, X...)

export default mongoose.model('Invite', inviteSchema)

// 중복 insert 시:
// E11000 duplicate key error collection

// 👉 그래서 보통 이렇게 처리함:

// try {
//   await Invite.create({ invitee, workspace });
// } catch (err) {
//   if (err.code === 11000) {
//     // "이미 초대한 유저입니다"
//   }
// }