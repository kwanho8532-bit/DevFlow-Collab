import express from 'express'
import * as projectController from '../controllers/project.js'

const router = express.Router()

router.post('/', projectController.newProjectAndProjectMember)

router.get('/archived', projectController.getArchived)

router.route('/:projectId')
    .get(projectController.projectDetail)
    .put(projectController.editProject)
    .delete(projectController.deleteProject)

router.patch('/:projectId/status', projectController.updateStatus)

router.patch('/:projectId/archive', projectController.archiving)

router.patch('/:projectId/unarchive', projectController.unarchiving)

router.route('/workspace/:workspaceId')
    .get(projectController.getProjectByWorkspace)
    .post(projectController.createProjectForWorkspace)

export default router

