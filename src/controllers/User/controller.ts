/* eslint-disable no-unused-vars */
import { Context } from 'koa'
import { FilterQueryAttributes } from 'models'
import routes from 'routes/public'
import Authorization from 'middlewares/Authorization'
import UserService from './service'

routes.get('/user', async (ctx: Context) => {
  const {
    page,
    pageSize,
    filtered,
    sorted,
  }: FilterQueryAttributes = ctx.request.query
  const { data, total } = await UserService.getAll(
    page,
    pageSize,
    filtered,
    sorted
  )

  ctx.status = 200
  ctx.body = {
    data,
    total,
  }
})

routes.get('/user/:id', async (ctx: Context) => {
  const { id } = ctx.params
  const { status, message, data } = await UserService.getOne(id)

  ctx.status = status
  ctx.body = {
    message,
    data,
  }
})

routes.post('/user', Authorization, async (ctx: Context) => {
  const formData = ctx.request.body
  const { message, data } = await UserService.create(formData)

  ctx.status = 201
  ctx.body = {
    message,
    data,
  }
})

routes.put('/user/:id', Authorization, async (ctx: Context) => {
  const { id } = ctx.params
  const formData = ctx.request.body
  const { status, message, data } = await UserService.update(id, formData)

  ctx.status = status
  ctx.body = {
    message,
    data,
  }
})

routes.delete('/user/:id', Authorization, async (ctx: Context) => {
  const { id } = ctx.params
  const { status, message } = await UserService.delete(id)

  ctx.status = status
  ctx.body = {
    message,
  }
})
