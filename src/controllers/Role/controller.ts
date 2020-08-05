/* eslint-disable no-unused-vars */
import { BaseContext, BaseRequest, Context } from 'koa'
import models from '../../models'

const { Roles } = models

export default class RoleController {
  public static async getAll(ctx: BaseContext) {
    const data = await Roles.findAll()
    const total = await Roles.count()

    ctx.status = 200
    ctx.body = {
      data,
      total,
    }
  }

  public static async getOne(ctx: Context) {
    const data = await Roles.findByPk(ctx.params.id)

    ctx.status = 200
    ctx.body = {
      data,
    }
  }
}
