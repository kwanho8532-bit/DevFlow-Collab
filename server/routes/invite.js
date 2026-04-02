import express from "express";
import * as inviteController from '../controllers/invite.js'

const router = express.Router()
console.log('inviteRouter')

router.route('/invites')
    .get(inviteController.getPendingInvites)
    .post(inviteController.createInvite)


export default router
