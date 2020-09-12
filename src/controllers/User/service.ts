/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import models from 'models'
import { filterQueryObject } from 'helpers/Common'
import useValidation from 'helpers/useValidation'
import { UserAttributes } from 'models/user'
import schema from './schema'

const { User } = models

class UserService {
  /**
   * Get All User
   */
  public static async getAll(
    page: string | number,
    pageSize: string | number,
    filtered: string,
    sorted: string
  ) {
    if (!page) page = 0
    if (!pageSize) pageSize = 10

    const filterObject = filtered ? filterQueryObject(JSON.parse(filtered)) : []

    const data = await User.findAll({
      where: filterObject,
      offset: Number(pageSize) * Number(page),
      limit: Number(pageSize),
      order: [['createdAt', 'desc']],
    })
    const total = await User.count({
      where: filterObject,
    })

    return { data, total }
  }

  /**
   * Get One User
   */
  public static async getOne(id: string) {
    const data = await User.findByPk(id)

    let message = ''
    let status = 0
    if (data) {
      status = 200
      message = 'The data was successfully obtained!'
    } else {
      status = 404
      message = 'Data not found or has been deleted!'
    }

    return { status, message, data }
  }

  /**
   * Create User
   */
  public static async create(formData: UserAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await User.create(value)

    return { message: 'Data has been added!', data }
  }

  /**
   * Update User By Id
   */
  public static async update(id: string, formData: UserAttributes) {
    const { status, data } = await this.getOne(id)

    if (data) {
      const value = useValidation(schema.create, {
        ...data.toJSON(),
        ...formData,
      })

      await data.update(value || {})
    }

    return { status, message: 'Data updated successfully!', data }
  }

  /**
   * Delete User By Id
   */
  public static async delete(id: string) {
    const { status, data } = await this.getOne(id)

    if (data) {
      await data.destroy()
    }

    return { status, message: 'Data deleted successfully!' }
  }
}

export default UserService
