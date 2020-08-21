/* eslint-disable no-unused-vars */
import { Context } from 'koa'
import { FilterQueryAttributes } from 'models'
import routes from 'routes/public'
import RoleService from './service'

routes.get('/role', async (ctx: Context) => {
  const {
    page,
    pageSize,
    filtered,
    sorted,
  }: FilterQueryAttributes = ctx.request.query
  const { data, total } = await RoleService.getAll(
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

routes.get('/role/:id', async (ctx: Context) => {
  const { id } = ctx.params
  const { status, message, data } = await RoleService.getOne(id)

  ctx.status = status
  ctx.body = {
    message,
    data,
  }
})

routes.post('/role', async (ctx: Context) => {
  const formData = ctx.request.body
  const { message, data } = await RoleService.create(formData)

  ctx.status = 201
  ctx.body = {
    message,
    data,
  }
})

routes.put('/role/:id', async (ctx: Context) => {
  const { id } = ctx.params
  const formData = ctx.request.body
  const { status, message, data } = await RoleService.update(id, formData)

  ctx.status = status
  ctx.body = {
    message,
    data,
  }
})

routes.delete('/role/:id', async (ctx: Context) => {
  const { id } = ctx.params
  const { status, message } = await RoleService.delete(id)

  ctx.status = status
  ctx.body = {
    message,
  }
})
