import express from 'express'
import * as taskController from '../controllers/task.js'
import { doubleCsrfProtection } from '../config/csrf.js'

const router = express.Router({ mergeParams: true })

// '/api/project/:projectId/task'
router.route('/')
    .get(taskController.getTasks)
    .post(doubleCsrfProtection, taskController.createTask)

// '/api/task/:taskId'
router.route('/')
    .put(doubleCsrfProtection, taskController.editTask)
    .delete(doubleCsrfProtection, taskController.taskDelete)

router.patch('/status', doubleCsrfProtection, taskController.changeStatus)

// '/api/project/:projectId'
router.get('/tasks', taskController.getTasksInWorkspaceProject)

// router.get('/task', taskController)

export default router

