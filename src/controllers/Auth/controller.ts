/* eslint-disable no-unused-vars */
import { Context } from 'koa'
import routes from 'routes/public'
import { verifyToken } from 'helpers/Common'
import AuthService from './service'

routes.post('/auth/sign-up', async (ctx: Context) => {
  const formData = ctx.request.body
  const { message, data } = await AuthService.signUp(formData)

  ctx.status = 200
  ctx.body = {
    message,
    data,
  }
})

routes.post('/auth/sign-in', async (ctx: Context) => {
  const formData = ctx.request.body
  const { status, message, data } = await AuthService.signIn(formData)

  ctx.status = status
  ctx.body = {
    message,
    data,
  }
})

routes.get('/profile', async (ctx: Context) => {
  const token = verifyToken(ctx.request.header)
  // @ts-ignore
  const { status, message, data } = await AuthService.profile(token)

  ctx.status = status
  ctx.body = {
    message,
    data,
  }
})
