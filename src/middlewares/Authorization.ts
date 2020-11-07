// eslint-disable-next-line no-unused-vars
import { Context, Next } from 'koa'
import { verifyToken } from 'helpers/Token'
import { isEmpty } from 'lodash'

async function Authorization(ctx: Context, next: Next) {
  const token = verifyToken(ctx.request.header)

  if (isEmpty(token?.data)) {
    ctx.status = 401
    ctx.body = {
      code: 401,
      message: token?.message,
    }
    return
  }

  await next()
}

export default Authorization
