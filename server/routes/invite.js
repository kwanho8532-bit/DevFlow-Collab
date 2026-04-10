import express from "express";
import * as inviteController from '../controllers/invite.js'
import { doubleCsrfProtection } from '../config/csrf.js'

const router = express.Router()
console.log('inviteRouter')

router.route('/invites')
    .get(inviteController.getPendingInvites)
    .post(doubleCsrfProtection, inviteController.createInvite)


export default router
