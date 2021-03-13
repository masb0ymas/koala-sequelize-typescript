import { ValidationError as YupError } from 'yup'
import {
  EmptyResultError,
  BaseError,
  ValidationError as SequelizeError,
} from 'sequelize'
import { get } from 'lodash'

type DataResponse =
  | {
      message?: string
      code?: number
    }
  | any

function msg(message: string) {
  return `Sequelize Error: ${message}`
}

class BuildResponse {
  private static baseResponse(dataResponse: DataResponse) {
    const {
      message = 'data has been received!',
      code = 200,
      ...rest
    } = dataResponse
    return {
      code,
      message,
      ...rest,
    }
  }

  /**
   * Response Success
   */
  public static get(dataResponse: DataResponse) {
    return this.baseResponse(dataResponse)
  }

  /**
   * Response Create
   */
  public static created(dataResponse: DataResponse) {
    return this.baseResponse({
      code: 201,
      message: 'data has been added!',
      ...dataResponse,
    })
  }

  /**
   * Response Update
   */
  public static updated(dataResponse: DataResponse) {
    return this.baseResponse({
      message: 'the data has been updated!',
      ...dataResponse,
    })
  }

  /**
   * Response Delete
   */
  public static deleted(dataResponse: DataResponse) {
    return this.baseResponse({
      message: 'data has been deleted!',
      ...dataResponse,
    })
  }

  /**
   *
   * Response Error
   */
  public static error(err: Error) {
    // Yup Error
    if (err instanceof YupError) {
      console.log('ERROR YUP VALIDATION!!!')

      const errorMsg = {
        code: 422,
        message: err.errors.join('<br/>') || 'Yup Validation Error !',
        errors:
          err.inner.length > 0
            ? err.inner.reduce((acc: any, curVal: any) => {
                acc[`${curVal.path}`] = curVal.message || curVal.type
                return acc
              }, {})
            : { [`${err.path}`]: err.message || err.type },
      }

      return this.baseResponse(errorMsg)
    }

    // Sequelize Error
    if (err instanceof BaseError) {
      if (err instanceof EmptyResultError) {
        return this.baseResponse({
          code: 404,
          message: msg('data not found'),
        })
      }

      if (err instanceof SequelizeError) {
        console.log('ERROR SEQUELIZE VALIDATION!!!')

        const errors: any[] = get(err, 'errors', [])
        const errorMessage = get(errors, '0.message', null)

        const dataError = {
          code: 400,
          message: errorMessage
            ? `Validation error: ${errorMessage}`
            : err.message,
          errors: errors.reduce<any>((acc, curVal) => {
            acc[curVal.path] = curVal.message
            return acc
          }, {}),
        }

        console.log(dataError.message, dataError.errors)

        return this.baseResponse(dataError)
      }

      return this.baseResponse({
        code: 500,
        message: msg(err.message),
      })
    }

    const statusCode = get(err, 'code', 400)
    const message = get(err, 'message', 'Oops, Try Again!')

    // Default Error
    return this.baseResponse({
      code: statusCode || 500,
      message: message || 'something went wrong!',
    })
  }
}

export default BuildResponse
