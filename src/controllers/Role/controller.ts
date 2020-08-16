/* eslint-disable no-unused-vars */
import { Context } from 'koa'
import models from 'models'
import useValidation from 'helpers/useValidation'
import schema from './schema'

const { Role } = models

export default class RoleController {
  public static async getAll(ctx: Context) {
    const data = await Role.findAll()
    const total = await Role.count()

    ctx.status = 200
    ctx.body = {
      data,
      total,
    }
  }

  public static async getOne(ctx: Context) {
    const { id } = ctx.params
    const data = await Role.findByPk(id)

    if (!data) {
      ctx.status = 404
      ctx.body = {
        message: 'Data tidak ditemukan atau sudah terhapus!',
      }
    } else {
      ctx.status = 200
      ctx.body = {
        data,
      }
    }
  }

  public static async create(ctx: Context) {
    const value = useValidation(schema.create, ctx.request.body)
    const data = await Role.create(value)

    ctx.status = 201
    ctx.body = {
      message: 'Data berhasil ditambahkan',
      data,
    }
  }

  public static async update(ctx: Context) {
    const { id } = ctx.params
    const data = await Role.findByPk(id)

    if (!data) {
      ctx.status = 404
      ctx.body = {
        message: 'Data tidak ditemukan atau sudah terhapus!',
      }
    } else {
      await data.update(ctx.request.body || {})

      ctx.status = 200
      ctx.body = {
        message: 'Data berhasil diperbarui!',
        data,
      }
    }
  }

  public static async delete(ctx: Context) {
    const { id } = ctx.params
    const data = await Role.findByPk(id)

    if (!data) {
      ctx.status = 404
      ctx.body = {
        message: 'Data tidak ditemukan atau sudah terhapus!',
      }
    } else {
      await data?.destroy()

      ctx.status = 200
      ctx.body = {
        message: 'Data berhasil dihapus!',
      }
    }
  }
}
