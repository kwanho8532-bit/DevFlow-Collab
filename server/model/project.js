import mongoose from 'mongoose'

const Schema = mongoose.Schema

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PLANNING', 'IN_PROGRESS', 'DONE', 'ARCHIVED'],
        default: 'PLANNING'
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        default: null
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    archivedAt: {
        type: Date,
        default: null
    },
    deadline: {
        type: Date,
        required: false, // 모든 프로젝트가 마감일이 있는 건 아닐 수 있으므로
    },
    userPriority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM' // 사용자가 지정한 기본 중요도
    }
})

const STATUS_TRANSITION = {
    PLANNING: 'IN_PROGRESS',
    IN_PROGRESS: 'DONE',
    DONE: 'ARCHIVED'
}

projectSchema.methods.changeStatus = function (nextStatus) {
    if (this.archivedAt) {
        throw new Error('보관된 프로젝트는 상태를 변경할 수 없습니다.')
    }

    const allowed = STATUS_TRANSITION[this.status]

    if (allowed !== nextStatus) {
        throw new Error(`유효하지 않은 상태 전환: ${this.status} -> ${nextStatus}`)
    }

    this.status = nextStatus
    return this.status
}

projectSchema.post('findOneAndDelete', async function (doc) {
    if (!doc) return

    await Promise.all([
        mongoose.model('ProjectMember').deleteMany({ project: doc._id }),
        mongoose.model('Task').deleteMany({ project: doc._id }),
    ])

    console.log(`프로젝트 ${doc.projectName}와(과) 관련된 projectMember, task 인스턴스가 모두 삭제되었습니다.`)
})

export default mongoose.model('Project', projectSchema)