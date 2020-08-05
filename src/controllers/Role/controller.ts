/* eslint-disable no-unused-vars */
import { BaseContext } from 'koa'

export default class RoleController {
  public static async getAll(ctx: BaseContext) {
    ctx.status = 200
    ctx.body = {
      data: [
        {
          id: 1,
          nama: 'Umum',
        },
        {
          id: 2,
          nama: 'Test',
        },
      ],
    }
  }
}
