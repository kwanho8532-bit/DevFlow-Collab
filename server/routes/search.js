import express from "express";
import * as searchController from '../controllers/search.js'

const router = express.Router()

router.get('/user/search', searchController.search)

export default router