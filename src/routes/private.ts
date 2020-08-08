/* eslint-disable no-unused-vars */
import Router from 'koa-router'
import AuthController from '../controllers/Auth/controller'

const router = new Router()

router.get('/auth/profile', AuthController.profile)

export default router
