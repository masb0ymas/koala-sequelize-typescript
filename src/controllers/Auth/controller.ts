/* eslint-disable no-unused-vars */
import { Context } from 'koa'
import routes from 'routes/public'
import { verifyToken } from 'helpers/Token'
import BuildResponse from 'modules/Response/BuildResponse'
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

routes.get('/auth/profile', async (ctx: Context) => {
  const token = verifyToken(ctx.request.header)
  // @ts-ignore
  const { code, message, data } = await AuthService.profile(token)
  const buildResponse = BuildResponse.get({ code, message, data })

  ctx.status = code
  ctx.body = buildResponse
})
