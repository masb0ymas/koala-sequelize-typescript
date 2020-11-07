/* eslint-disable no-unused-vars */
import models from 'models'
import jwt from 'jsonwebtoken'
import createDirNotExist from 'utils/Directory'
import { UserAttributes, LoginAttributes, TokenAttributes } from 'models/user'
import { getUniqueCodev2 } from 'helpers/Common'
import useValidation from 'helpers/useValidation'
import schema from 'controllers/User/schema'
import { isObject } from 'lodash'

require('dotenv').config()

const { User, Role } = models

const { JWT_SECRET }: any = process.env
const expiresToken = 7 * 24 * 60 * 60 // 7 Days

/*
  Create the main directory
  The directory will be created automatically when logged in,
  because there is a directory that uses a User ID
*/
async function createDirectory(UserId: string) {
  const pathDirectory = [
    './public/uploads/csv',
    './public/uploads/excel',
    `./public/uploads/profile/${UserId}`,
  ]

  pathDirectory.map((x) => createDirNotExist(x))
}

class AuthService {
  /**
   * Sign Up
   */
  public static async signUp(formData: UserAttributes) {
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

    const newFormData = { ...formData, tokenVerify }
    const value = useValidation(schema.create, newFormData)
    const data = await User.create(value)
    const message =
      'registration is successful, check your email for the next steps'

    return { message, data }
  }

  /**
   * Sign In
   */
  public static async signIn(formData: LoginAttributes) {
    const { email, password } = useValidation(schema.login, formData)

    const userData = await User.scope('withPassword').findOne({
      where: { email },
    })

    if (userData) {
      /* User active proses login */
      if (userData.active) {
        // @ts-ignore
        const comparePassword = userData.comparePassword(password)

        if (comparePassword) {
          // modif payload token
          const payloadToken = {
            id: userData.id,
            nama: userData.fullName,
            active: userData.active,
          }

          const token = jwt.sign(
            JSON.parse(JSON.stringify(payloadToken)),
            JWT_SECRET,
            {
              expiresIn: expiresToken,
            }
          )

          // create directory
          await createDirectory(userData.id)
          const data = {
            token,
            expiresIn: expiresToken,
            tokenType: 'Bearer',
          }

          return {
            code: 200,
            message: 'access token has been received!',
            data,
          }
        }

        return {
          code: 400,
          message: 'incorrect email or password!',
          data: null,
        }
      }

      /* User not active return error confirm email */
      return {
        code: 400,
        message:
          'please check your email account to verify your email and continue the registration process.',
        data: null,
      }
    }

    return {
      code: 404,
      message: 'data not found or has been deleted',
      data: null,
    }
  }

  /**
   * Profile
   */
  public static async profile(token: TokenAttributes) {
    if (isObject(token?.data)) {
      const decodeToken = token?.data
      const message = token?.message
      const including = [{ model: Role }]

      // @ts-ignore
      const data = await User.findByPk(decodeToken?.id, { include: including })

      return { code: 200, message, data }
    }

    return {
      code: 401,
      message: `${token?.message}. Please Re-login...`,
      data: null,
    }
  }
}

export default AuthService
