import { Context } from 'koa'
import routes from 'routes/public'
import BuildResponse from 'modules/Response/BuildResponse'
import Authorization from 'middlewares/Authorization'
import AuthService from './service'

routes.post('/auth/sign-up', async (ctx: Context) => {
  try {
    const formData = ctx.request.body

    const data = await AuthService.signUp(formData)
    const buildResponse = BuildResponse.get(data)

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})

routes.post('/auth/sign-in', async (ctx: Context) => {
  try {
    const formData = ctx.request.body

    const data = await AuthService.signIn(formData)
    const buildResponse = BuildResponse.get(data)

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})

routes.get('/profile', Authorization, async (ctx: Context) => {
  try {
    const userData = ctx.state.user

    const data = await AuthService.profile(userData)
    const buildResponse = BuildResponse.get({ data })

    ctx.status = 200
    ctx.body = buildResponse
  } catch (err) {
    const buildResponse = BuildResponse.error(err)

    ctx.status = buildResponse.code
    ctx.body = buildResponse
  }
})
