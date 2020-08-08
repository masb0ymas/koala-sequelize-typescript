/* eslint-disable no-unused-vars */
import Router from 'koa-router'
import passport from 'passport'
import AuthController from '../controllers/Auth/controller'

const router = new Router()

require('../config/passport')(passport)

const AuthMiddleware = passport.authenticate('jwt', { session: false })

router.get('/auth/profile', AuthController.profile)

export default router
