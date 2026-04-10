import express from 'express'
import * as globalController from '../controllers/global.js'

const router = express.Router()

router.get('/auth', globalController.auth)

router.get('/auth/status', globalController.checkAuth)

router.get('/currProject', globalController.currProject)

router.get('/csrf-token', globalController.csrfToken)

export default router

