import models from 'models'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/roles'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from './schema'

const { Role } = models

class RoleService {
  /**
   * Get All Role
   */
  public static async getAll(ctx: any) {
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      ctx,
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
   * Get One Role
   */
  public static async getOne(id: string) {
    const data = await Role.findByPk(id)

    let code = 200
    let message = 'data has been received'

    if (!data) {
      code = 404
      message = 'Data not found or has been deleted!'
    }

    return { code, message, data }
  }

  /**
   * Create Role
   */
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return data
  }

  /**
   * Update Role By Id
   */
  public static async update(id: string, formData: RoleAttributes) {
    const { data } = await this.getOne(id)

    if (data) {
      const value = useValidation(schema.create, {
        ...data.toJSON(),
        ...formData,
      })

      await data.update(value || {})
    }

    return data
  }

  /**
   * Delete Role By Id
   */
  public static async delete(id: string) {
    const { data } = await this.getOne(id)

    if (data) {
      await data.destroy()
    }
  }
}

export default RoleService
