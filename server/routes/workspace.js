import express from 'express'
import * as workspaceController from '../controllers/workspace.js'
import doubleCsrfProtection from '../config/csrf.js'

const router = express.Router()

router.route('/')
    .get(workspaceController.getAllWorkspaces)
    .post(doubleCsrfProtection, workspaceController.createWorkspace)

router.get('/mine', workspaceController.getMyWorkspaces)

router.get('/:workspaceId', workspaceController.getSelectedWorkspace)

router.get('/:workspaceId/workspace-member', workspaceController.getWorkspaceMember)

router.patch('/:inviteId', doubleCsrfProtection, workspaceController.acceptAndJoin)

export default router