import Role from './roles'
import User from './user'

export default {
  Role,
  User,
}

/*
  Models Association
*/

User.belongsTo(Role)
