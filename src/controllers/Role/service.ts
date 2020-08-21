/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import models from 'models'
import { filterQueryObject } from 'helpers/Common'
import useValidation from 'helpers/useValidation'
import { RoleAttributes } from 'models/roles'
import schema from './schema'

const { Role } = models

class RoleService {
  /**
   * Get All Role
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

    const data = await Role.findAll({
      where: filterObject,
      offset: Number(pageSize) * Number(page),
      limit: Number(pageSize),
      order: [['createdAt', 'desc']],
    })
    const total = await Role.count({
      where: filterObject,
    })

    return { data, total }
  }

  /**
   * Get One Role
   */
  public static async getOne(id: string) {
    const data = await Role.findByPk(id)

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
   * Create Role
   */
  public static async create(formData: RoleAttributes) {
    const value = useValidation(schema.create, formData)
    const data = await Role.create(value)

    return { message: 'Data has been added!', data }
  }

  /**
   * Update Role By Id
   */
  public static async update(id: string, formData: RoleAttributes) {
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
   * Delete Role By Id
   */
  public static async delete(id: string) {
    const { status, data } = await this.getOne(id)

    if (data) {
      await data.destroy()
    }

    return { status, message: 'Data deleted successfully!' }
  }
}

export default RoleService
