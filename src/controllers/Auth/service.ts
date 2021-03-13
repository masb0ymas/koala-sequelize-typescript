import models from 'models'
import ms from 'ms'
import jwt from 'jsonwebtoken'
import createDirNotExist from 'utils/Directory'
import { UserAttributes, LoginAttributes } from 'models/user'
import { getUniqueCodev2 } from 'helpers/Common'
import useValidation from 'helpers/useValidation'
import schema from 'controllers/User/schema'
import UserService from 'controllers/User/service'
import ResponseError from 'modules/Response/ResponseError'

require('dotenv').config()

const { User, Role } = models
const including = [{ model: Role }]

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
    // check duplicate email
    await UserService.validateUserEmail(formData.email)

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

    if (!userData) {
      throw new ResponseError.NotFound('account not found or has been deleted')
    }

    /* User active proses login */
    if (userData.active) {
      // @ts-ignore
      const comparePassword = await userData.comparePassword(password)

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
          message: 'Login successfully',
          data,
        }
      }

      throw new ResponseError.BadRequest('incorrect email or password!')
    }

    /* User not active return error confirm email */
    throw new ResponseError.BadRequest(
      'please check your email account to verify your email and continue the registration process.'
    )
  }

  /**
   *
   * @param userData
   */
  public static async profile(userData: UserAttributes) {
    const data = await User.findByPk(userData.id, { include: including })
    return data
  }
}

export default AuthService
