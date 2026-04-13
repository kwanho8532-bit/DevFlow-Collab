import express from 'express'
import * as globalController from '../controllers/global.js'

const router = express.Router()

router.use((req, res, next) => {
    console.log('🔥 globalRouter hit:', req.method, req.url);
    next();
});

router.get('/auth', globalController.auth)

router.get('/auth/status', globalController.checkAuth)

router.get('/currProject', globalController.currProject)

router.get('/csrf-token', globalController.csrfToken)

export default router

