/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import models from 'models'
import { filterQueryObject } from 'helpers/Common'
import useValidation from 'helpers/useValidation'
import { UserAttributes } from 'models/user'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import schema from './schema'

const { User, Role } = models
const including = [{ model: Role }]

class UserService {
  /**
   * Get All User
   */
  public static async getAll(ctx: any) {
    const { filtered } = ctx.request.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      ctx,
      User,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, including)
    )

    const data = await User.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await User.count({
      include: includeCount,
      where: queryFind.where,
    })

    return { message: `${total} data has been received.`, data, total }
  }

  /**
   * Get One User
   */
  public static async getOne(id: string) {
    const data = await User.findByPk(id)

    let code = 200
    let message = 'data has been received'

    if (!data) {
      code = 404
      message = 'Data not found or has been deleted!'
    }

    return { code, message, data }
  }

  /**
   * Create User
   */
  public static async create(formData: UserAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await User.create(value)

    return data
  }

  /**
   * Update User By Id
   */
  public static async update(id: string, formData: UserAttributes) {
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
   * Delete User By Id
   */
  public static async delete(id: string) {
    const { data } = await this.getOne(id)

    if (data) {
      await data.destroy()
    }
  }
}

export default UserService
