/* eslint-disable no-unused-vars */
import { BaseContext } from 'koa'
import Router from 'koa-router'
import publicRoute from './public'
import privateRoute from './private'

const router = new Router()

router.get('/', (ctx: BaseContext) => {
  ctx.status = 200
  ctx.body = {
    message: 'Welcome to 🐨 KoaLaa TypeScript...',
  }
})

router.get('/v1', (ctx: BaseContext) => {
  ctx.status = 403
  ctx.body = {
    message: 'Hayo Mau ngapain ??',
  }
})

// Public Routes
router.use('/v1', publicRoute.routes())
router.use('/v1', publicRoute.allowedMethods())
// Private Routes
router.use('/v1', privateRoute.routes())
router.use('/v1', privateRoute.allowedMethods())

export default router
