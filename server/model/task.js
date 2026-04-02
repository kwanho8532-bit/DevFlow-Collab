import mongoose from 'mongoose'

const Schema = mongoose.Schema

const taskSchema = new Schema({
    taskName: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    userImportance: {
        type: String,
        enum: ['SUPPORT', 'OPERATIONAL', 'STRATEGIC'],
        default: 'SUPPORT'
    }
})

taskSchema.methods.changeStatus = function () {
    this.done = !this.done
    return this.save()
}

export default mongoose.model('Task', taskSchema)