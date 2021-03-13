import { Context } from 'koa'
import routes from 'routes/public'
import Authorization from 'middlewares/Authorization'
import BuildResponse from 'modules/Response/BuildResponse'
import UserService from './service'

routes.get('/user', async (ctx: Context) => {
  try {
    const data = await UserService.getAll(ctx)
    const buildResponse = BuildResponse.get(data)

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})

routes.get('/user/:id', Authorization, async (ctx: Context) => {
  try {
    const { id } = ctx.params

    const data = await UserService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})

routes.post('/user', Authorization, async (ctx: Context) => {
  try {
    const formData = ctx.request.body

    const data = await UserService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    ctx.status = 201
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})

routes.put('/user/:id', Authorization, async (ctx: Context) => {
  try {
    const { id } = ctx.params
    const formData = ctx.request.body

    const data = await UserService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})

routes.delete('/user/:id', Authorization, async (ctx: Context) => {
  try {
    const { id } = ctx.params

    await UserService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})
