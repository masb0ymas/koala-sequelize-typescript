import { Context } from 'koa'
import routes from 'routes/public'
import BuildResponse from 'modules/Response/BuildResponse'
import Authorization from 'middlewares/Authorization'
import AuthService from './service'

routes.post('/auth/sign-up', async (ctx: Context) => {
  const formData = ctx.request.body

  const { message, data } = await AuthService.signUp(formData)
  const buildResponse = BuildResponse.get({ message, data })

  ctx.status = 200
  ctx.body = buildResponse
})

routes.post('/auth/sign-in', async (ctx: Context) => {
  const formData = ctx.request.body

  const { code, message, data } = await AuthService.signIn(formData)
  const buildResponse = BuildResponse.get({ code, message, data })

  ctx.status = code
  ctx.body = buildResponse
})

routes.get('/profile', Authorization, async (ctx: Context) => {
  const { id } = ctx.state.user

  const { code, data } = await AuthService.profile(id)
  const buildResponse = BuildResponse.get({ code, data })

  ctx.status = code
  ctx.body = buildResponse
})
