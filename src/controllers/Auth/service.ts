import models from 'models'
import ms from 'ms'
import jwt from 'jsonwebtoken'
import createDirNotExist from 'utils/Directory'
import { UserAttributes, LoginAttributes, TokenAttributes } from 'models/user'
import { getUniqueCodev2 } from 'helpers/Common'
import useValidation from 'helpers/useValidation'
import schema from 'controllers/User/schema'
import { isObject } from 'lodash'

require('dotenv').config()

const { User, Role } = models

const { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN }: any = process.env

const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '1d' // 7 Days
const JWT_REFRESH_TOKEN_EXPIRED = process.env.JWT_REFRESH_TOKEN_EXPIRED || '30d' // 30 Days

const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED) / 1000

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
   *
   * @param formData
   */
  public static async signUp(formData: UserAttributes) {
    const generateToken = {
      code: getUniqueCodev2(),
    }

    const tokenVerify = jwt.sign(
      JSON.parse(JSON.stringify(generateToken)),
      JWT_SECRET_ACCESS_TOKEN,
      {
        expiresIn,
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
   *
   * @param formData
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

          // Access Token
          const accessToken = jwt.sign(
            JSON.parse(JSON.stringify(payloadToken)),
            JWT_SECRET_ACCESS_TOKEN,
            {
              expiresIn,
            }
          )

          // Refresh Token
          const refreshToken = jwt.sign(
            JSON.parse(JSON.stringify(payloadToken)),
            JWT_SECRET_REFRESH_TOKEN,
            {
              expiresIn: JWT_REFRESH_TOKEN_EXPIRED,
            }
          )

          // create directory
          await createDirectory(userData.id)
          const data = {
            accessToken,
            expiresIn,
            tokenType: 'Bearer',
            refreshToken,
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
   *
   * @param token
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
