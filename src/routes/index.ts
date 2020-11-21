/* eslint-disable no-unused-vars */
import { BaseContext } from 'koa'
import Router from 'koa-router'
import publicRoute from './public'

const router = new Router()

router.get('/', (ctx: BaseContext) => {
  ctx.status = 200
  ctx.body = {
    code: 200,
    message: 'Welcome to 🐨 KoaLaa TypeScript...',
  }
})

router.get('/v1', (ctx: BaseContext) => {
  ctx.status = 403
  ctx.body = {
    code: 200,
    message: 'forbidden, wrong access endpoint',
  }
})

// Public Routes
router.use('/v1', publicRoute.routes())
router.use('/v1', publicRoute.allowedMethods())

export default router
