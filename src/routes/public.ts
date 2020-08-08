/* eslint-disable no-unused-vars */
import Router from 'koa-router'
import AuthController from '../controllers/Auth/controller'
import RoleController from '../controllers/Role/controller'

const router = new Router()

router.post('/auth/sign-in', AuthController.signIn)
router.post('/auth/sign-up', AuthController.signUp)

router.get('/role', RoleController.getAll)
router.post('/role', RoleController.create)
router.get('/role/:id', RoleController.getOne)
router.put('/role/:id', RoleController.update)
router.delete('/role/:id', RoleController.delete)

export default router
