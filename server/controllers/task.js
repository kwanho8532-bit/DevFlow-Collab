import { change, create, deleteTask, edit, findTaskById, findTasks, findTasksByProjectId } from "../services/task.js";
import catchAsync from "../utils/catchAsync.js";


export const getTasks = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { projectId } = req.params

    const tasks = await findTasks(projectId)

    return res.status(200).json({ tasks })
})

export const createTask = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const userId = req.user._id
    const { projectId } = req.params

    const task = await create(userId, projectId, req.body)
    res.status(200).json(task)
})

export const editTask = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { taskId } = req.params

    const targetTask = await edit(taskId, req.body)

    res.status(200).json(targetTask)
})

export const changeStatus = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { taskId } = req.params

    const targetTask = await findTaskById(taskId)
    await change(targetTask)

    return res.status(200).json(targetTask)
})

export const taskDelete = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { taskId } = req.params

    const targetTask = await deleteTask(taskId)

    res.status(200).json(targetTask)
})


export const getTasksInWorkspaceProject = catchAsync(async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: '로그인이 필요합니다.'
        })
    }

    const { projectId } = req.params

    const tasks = await findTasksByProjectId(projectId)

    res.status(200).json(tasks)
})

// export const addTaskInWorkspaceProject = catchAsync(async function (req, res, next) {
//     if (!req.isAuthenticated()) {
//         return res.status(401).json({
//             message: '로그인이 필요합니다.'
//         })
//     }

//     const { workspaceId } = req.params

//     const targetTask = 
    
// })

