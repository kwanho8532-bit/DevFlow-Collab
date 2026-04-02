import Task from "../model/task.js"


export const findTasks = async (projectId) => {
    const tasks = await Task.find({ project: projectId }).populate('user')

    return tasks
}

export const create = async (userId, projectId, { taskName, userImportance }) => {
    const task = await new Task({
        taskName,
        status: 'IN_PROGRESS',
        user: userId,
        project: projectId,
        userImportance
    }).save()

    return task.populate('user')
}

export const edit = async (taskId, { taskName, userImportance }) => {
    const targetTask = await Task.findByIdAndUpdate(taskId, {
        taskName,
        userImportance
    }, { returnDocument: 'after' }).populate('user')

    return targetTask
}

export const findTaskById = async (taskId) => {
    const targetTask = await Task.findById(taskId).populate('user')

    return targetTask
}

export const change = async (target) => {
    await target.changeStatus()
}

export const deleteTask = async (taskId) => {
    const targetTask = await Task.findByIdAndDelete(taskId)

    return targetTask
}

export const findTasksByProjectId = async (projectId) => {
    const tasks = await Task.find({ project: projectId }).populate('user')
    return tasks
}
