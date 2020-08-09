/* eslint-disable no-unused-vars */
import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import { isObject } from 'lodash'
import { getUniqueCodev2, verifyToken } from '../../helpers/Common'
import useValidation from '../../helpers/useValidation'
import createDirNotExist from '../../utils/Directory'
import models from '../../models'
import schema from '../User/schema'

const { User, Role } = models
const { JWT_SECRET }: any = process.env
const expiresToken = 86400 * 1 // 1 Days

/*
  Create the main directory
  direktori akan dibikin otomatis ketika login,
  karna direktori ada yang menggunakan User ID
*/
async function createDirectory(UserId: string) {
  const pathDirectory = [
    './public/uploads/csv',
    './public/uploads/excel',
    `./public/uploads/profile/${UserId}`,
  ]

  pathDirectory.map((x) => createDirNotExist(x))
}

export default class AuthController {
  public static async signUp(ctx: Context) {
    const generateToken = {
      code: getUniqueCodev2(),
    }

    const tokenVerify = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET,
      {
        expiresIn: expiresToken,
      }
    )

    const rawFormData = { ...ctx.request.body, tokenVerify }
    const value = useValidation(schema.create, rawFormData)
    const data = await User.create(value)

    ctx.status = 200
    ctx.body = {
      data,
      message:
        'Registrasi berhasil, Check email Anda untuk langkah selanjutnya!',
    }
  }

  public static async signIn(ctx: Context) {
    const { email, password } = useValidation(schema.login, ctx.request.body)

    const userData = await User.scope('withPassword').findOne({
      where: { email },
    })

    if (userData) {
      /* User active proses login */
      if (userData.active) {
        // @ts-ignore
        const comparePassword = await userData.comparePassword(password)

        if (comparePassword) {
          const userDataJson = userData.toJSON()

          const token = jwt.sign(
            JSON.parse(JSON.stringify(userDataJson)),
            JWT_SECRET,
            {
              expiresIn: expiresToken,
            }
          )

          // create directory
          await createDirectory(userData.id)

          ctx.status = 200
          ctx.body = {
            token: `JWT ${token}`,
            uid: userData.id,
          }
        } else {
          ctx.status = 400
          ctx.body = {
            message: 'Email atau password salah!',
          }
        }
      } else {
        /* User not active return error confirm email */
        ctx.status = 400
        ctx.body = {
          message:
            'Please check your email account to verify your email and continue the registration process.',
        }
      }
    } else {
      ctx.status = 404
      ctx.body = {
        message: 'Data tidak ditemukan!',
      }
    }
  }

  public static async profile(ctx: Context) {
    const token = verifyToken(ctx.request.header)

    if (isObject(token?.data)) {
      const decodeToken = token?.data
      const including = [{ model: Role }]

      // @ts-ignore
      const data = await User.findByPk(decodeToken?.id, { include: including })
      ctx.status = 200
      ctx.body = {
        data,
      }
    } else {
      ctx.status = 401
      ctx.body = {
        message: `${token?.message}. Please Re-login...`,
      }
    }
  }
}
