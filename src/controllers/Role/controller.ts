import { Context } from 'koa'
import routes from 'routes/public'
import Authorization from 'middlewares/Authorization'
import BuildResponse from 'modules/Response/BuildResponse'
import RoleService from './service'

routes.get('/role', async (ctx: Context) => {
  try {
    const { message, data, total } = await RoleService.getAll(ctx)
    const buildResponse = BuildResponse.get({ message, data, total })

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const { message, statusCode: code } = err
    const buildResponse = BuildResponse.get({ code, message })

    ctx.status = code
    ctx.body = buildResponse
  }
})

routes.get('/role/:id', async (ctx: Context) => {
  try {
    const { id } = ctx.params

    const data = await RoleService.getOne(id)
    const buildResponse = BuildResponse.get({ data })

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const { message, statusCode: code } = err
    const buildResponse = BuildResponse.get({ code, message })

    ctx.status = code
    ctx.body = buildResponse
  }
})

routes.post('/role', Authorization, async (ctx: Context) => {
  try {
    const formData = ctx.request.body

    const data = await RoleService.create(formData)
    const buildResponse = BuildResponse.created({ data })

    ctx.status = 201
    ctx.body = buildResponse
  } catch (err) {
    const { message, statusCode: code } = err
    const buildResponse = BuildResponse.get({ code, message })

    ctx.status = code
    ctx.body = buildResponse
  }
})

routes.put('/role/:id', Authorization, async (ctx: Context) => {
  try {
    const { id } = ctx.params
    const formData = ctx.request.body

    const data = await RoleService.update(id, formData)
    const buildResponse = BuildResponse.updated({ data })

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const { message, statusCode: code } = err
    const buildResponse = BuildResponse.get({ code, message })

    ctx.status = code
    ctx.body = buildResponse
  }
})

routes.delete('/role/:id', Authorization, async (ctx: Context) => {
  try {
    const { id } = ctx.params

    await RoleService.delete(id)
    const buildResponse = BuildResponse.deleted({})

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const { message, statusCode: code } = err
    const buildResponse = BuildResponse.get({ code, message })

    ctx.status = code
    ctx.body = buildResponse
  }
})
