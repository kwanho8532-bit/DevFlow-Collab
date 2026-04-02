import express from 'express'
import * as taskController from '../controllers/task.js'

const router = express.Router({ mergeParams: true })

// '/api/project/:projectId/task'
router.route('/')
    .get(taskController.getTasks)
    .post(taskController.createTask)

// '/api/task/:taskId'
router.route('/')
    .put(taskController.editTask)
    .delete(taskController.taskDelete)

router.patch('/status', taskController.changeStatus)

// '/api/project/:projectId'
router.get('/tasks', taskController.getTasksInWorkspaceProject)

// router.get('/task', taskController)

export default router

