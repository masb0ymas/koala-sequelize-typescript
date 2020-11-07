import { Context } from 'koa'
import routes from 'routes/public'
import Authorization from 'middlewares/Authorization'
import BuildResponse from 'modules/Response/BuildResponse'
import UserService from './service'

routes.get('/user', Authorization, async (ctx: Context) => {
  const { message, data, total } = await UserService.getAll(ctx)
  const buildResponse = BuildResponse.get({ message, data, total })

  ctx.status = 200
  ctx.body = buildResponse
})

routes.get('/user/:id', Authorization, async (ctx: Context) => {
  const { id } = ctx.params

  const { code, message, data } = await UserService.getOne(id)
  const buildResponse = BuildResponse.get({ code, message, data })

  ctx.status = code
  ctx.body = buildResponse
})

routes.post('/user', Authorization, async (ctx: Context) => {
  const formData = ctx.request.body

  const data = await UserService.create(formData)
  const buildResponse = BuildResponse.created({ data })

  ctx.status = 201
  ctx.body = buildResponse
})

routes.put('/user/:id', Authorization, async (ctx: Context) => {
  const { id } = ctx.params
  const formData = ctx.request.body

  const { code, message, data } = await UserService.update(id, formData)
  const buildResponse = BuildResponse.updated({ code, message, data })

  ctx.status = 200
  ctx.body = buildResponse
})

routes.delete('/user/:id', Authorization, async (ctx: Context) => {
  const { id } = ctx.params

  const { code, message } = await UserService.delete(id)
  const buildResponse = BuildResponse.deleted({ code, message })

  ctx.status = 200
  ctx.body = buildResponse
})
