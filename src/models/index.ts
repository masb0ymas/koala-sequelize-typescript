import Role from './roles'
import User from './user'

const models = {
  Role,
  User,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model?.associate) {
    model.associate(models)
  }
  return model
})
