/* eslint-disable no-unused-vars */
import { BaseContext } from 'koa'
import Router from 'koa-router'
import RoleController from '../controllers/Role/controller'

const router = new Router()

router.get('/role', RoleController.getAll)
router.post('/role', RoleController.create)
router.get('/role/:id', RoleController.getOne)
router.put('/role/:id', RoleController.update)
router.delete('/role/:id', RoleController.delete)

export default router
