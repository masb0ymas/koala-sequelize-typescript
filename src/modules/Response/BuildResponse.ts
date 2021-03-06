import { ValidationError as YupError } from 'yup'
import {
  EmptyResultError,
  BaseError,
  ValidationError as SequelizeError,
} from 'sequelize'
import { get } from 'lodash'

type DataResponse<T> = {
  message?: string
  code?: number
} & T

function msg(message: string) {
  return `Sequelize Error: ${message}`
}

class BuildResponse {
  private static baseResponse<T>(dataResponse: DataResponse<T>) {
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
  public static get<T>(dataResponse: DataResponse<T>) {
    return this.baseResponse(dataResponse)
  }

  /**
   * Response Create
   */
  public static created<T>(dataResponse: DataResponse<T>) {
    return this.baseResponse({
      code: 201,
      message: 'data has been added!',
      ...dataResponse,
    })
  }

  /**
   * Response Update
   */
  public static updated<T>(dataResponse: DataResponse<T>) {
    return this.baseResponse({
      message: 'the data has been updated!',
      ...dataResponse,
    })
  }

  /**
   * Response Delete
   */
  public static deleted<T>(dataResponse: DataResponse<T>) {
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

    const code = get(err, 'statusCode', 500)
    const message = get(err, 'message', 'something went wrong!')

    // Default Error
    return this.baseResponse({ code, message })
  }
}

export default BuildResponse
