import { Context, Next } from 'koa'
import { getToken, verifyAccessToken } from 'helpers/Token'
import { isEmpty } from 'lodash'

async function Authorization(ctx: Context, next: Next) {
  const getCurrentToken = getToken(ctx.request.header)
  const token = verifyAccessToken(getCurrentToken)

  if (isEmpty(token?.data)) {
    ctx.status = 401
    ctx.body = {
      code: 401,
      message: token?.message,
    }
    return
  }

  ctx.state.user = token?.data
  await next()
}

export default Authorization
