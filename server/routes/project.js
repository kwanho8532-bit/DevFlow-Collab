import express from 'express'
import * as projectController from '../controllers/project.js'
import { doubleCsrfProtection } from '../config/csrf.js'

const router = express.Router()

router.post('/', doubleCsrfProtection, projectController.newProjectAndProjectMember)

router.get('/archived', projectController.getArchived)

router.route('/:projectId')
    .get(projectController.projectDetail)
    .put(doubleCsrfProtection, projectController.editProject)
    .delete(doubleCsrfProtection, projectController.deleteProject)

router.patch('/:projectId/status', doubleCsrfProtection, projectController.updateStatus)

router.patch('/:projectId/archive', doubleCsrfProtection, projectController.archiving)

router.patch('/:projectId/unarchive', doubleCsrfProtection, projectController.unarchiving)

router.route('/workspace/:workspaceId')
    .get(projectController.getProjectByWorkspace)
    .post(doubleCsrfProtection, projectController.createProjectForWorkspace)

export default router

