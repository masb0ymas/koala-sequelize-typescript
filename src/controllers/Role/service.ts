import { Context } from 'koa'
import models from 'models'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/roles'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import ResponseError from 'modules/Response/ResponseError'
import schema from './schema'

const { Role } = models

class RoleService {
  /**
   *
   * @param ctx - Context
   */
  public static async getAll(ctx: Context) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      ctx.request.query,
      Role,
      []
    )

    const data = await Role.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await Role.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   *
   * @param id
   */
  public static async getOne(id: string) {
    const data = await Role.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound(
        'role data not found or has been deleted!'
      )
    }

    return data
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: RoleAttributes) {
    const data = await this.getOne(id)

    const value = useValidation(schema.create, {
      ...data.toJSON(),
      ...formData,
    })

    await data.update(value || {})

    return data
  }

  /**
   *
   * @param id
   */
  public static async delete(id: string) {
    const data = await this.getOne(id)

    if (data) {
      await data.destroy()
    }
  }
}

export default RoleService
