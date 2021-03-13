import Router from '@koa/router'

const router = new Router()

export default router

require('controllers/Auth/controller')
require('controllers/User/controller')
require('controllers/Role/controller')
