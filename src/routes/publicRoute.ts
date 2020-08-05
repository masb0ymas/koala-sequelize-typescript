/* eslint-disable no-unused-vars */
import { BaseContext } from 'koa'
import Router from 'koa-router'
import RoleController from '../controllers/Role/controller'

const router = new Router()

router.get('/role', RoleController.getAll)
router.get('/role/:id', RoleController.getOne)

export default router
