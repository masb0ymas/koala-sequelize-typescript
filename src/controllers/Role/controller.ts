/* eslint-disable no-unused-vars */
import { Context } from 'koa'
import models from '../../models'

const { Roles } = models

export default class RoleController {
  public static async getAll(ctx: Context) {
    const data = await Roles.findAll()
    const total = await Roles.count()

    ctx.status = 200
    ctx.body = {
      data,
      total,
    }
  }

  public static async getOne(ctx: Context) {
    const { id } = ctx.params
    const data = await Roles.findByPk(id)

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
    const data = await Roles.create(ctx.request.body)

    ctx.status = 201
    ctx.body = {
      message: 'Data berhasil ditambahkan',
      data,
    }
  }

  public static async update(ctx: Context) {
    const { id } = ctx.params
    const data = await Roles.findByPk(id)

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
    const data = await Roles.findByPk(id)

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
