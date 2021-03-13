import { Context } from 'koa'
import models from 'models'
import useValidation from 'helpers/useValidation'
import { UserAttributes } from 'models/user'
import PluginSqlizeQuery from 'modules/SqlizeQuery/PluginSqlizeQuery'
import ResponseError from 'modules/Response/ResponseError'
import schema from './schema'

const { User, Role } = models
const including = [{ model: Role }]

class UserService {
  /**
   *
   * @param ctx - Context
   */
  public static async getAll(ctx: Context) {
    const { filtered } = ctx.request.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      ctx.request.query,
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
   *
   * @param id
   */
  public static async getOne(id: string) {
    const data = await User.findByPk(id)

    if (!data) {
      throw new ResponseError.BadRequest(
        'user data not found or has been deleted!'
      )
    }

    return data
  }

  /**
   *
   * @param email
   */
  public static async validateUserEmail(email: string) {
    const data = await User.findOne({ where: { email } })

    if (data) {
      throw new ResponseError.BadRequest('email address already in use')
    }

    return null
  }

  /**
   *
   * @param formData
   */
  public static async create(formData: UserAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await User.create(value)

    return data
  }

  /**
   *
   * @param id
   * @param formData
   */
  public static async update(id: string, formData: UserAttributes) {
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

    await data.destroy()
  }
}

export default UserService
