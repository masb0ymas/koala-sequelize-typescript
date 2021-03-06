import { BaseContext } from 'koa'
import Router from '@koa/router'
import BuildResponse from 'modules/Response/BuildResponse'
import { BASE_URL_SERVER } from 'config/baseURL'
import publicRoute from './public'

const router = new Router()

router.get('/', (ctx: BaseContext) => {
  const buildResponse = BuildResponse.get({
    message: 'Koa Sequelize TypeScript',
    maintaner: 'masb0ymas, <n.fajri@outlook.com>',
    source: 'https://github.com/masb0ymas/koala-sequelize-typescript',
    docs: `${BASE_URL_SERVER}/v1/api-docs`,
  })

  ctx.status = 200
  ctx.body = buildResponse
})

router.get('/v1', (ctx: BaseContext) => {
  const code = 403
  const buildResponse = BuildResponse.get({
    code,
    message: 'forbidden, wrong access endpoint',
  })

  ctx.status = code
  ctx.body = buildResponse
})

// Public Routes
router.use('/v1', publicRoute.routes())
router.use('/v1', publicRoute.allowedMethods())

export default router
