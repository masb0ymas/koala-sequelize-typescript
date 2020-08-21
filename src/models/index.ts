import Role from './roles'
import User from './user'

export interface FilterAttributes {
  id: string
  value: string
}

export interface SortAttributes {
  id: string
  desc: string
}

export interface FilterQueryAttributes {
  page: string | number
  pageSize: string | number
  filtered: string
  sorted: string
}

export default {
  Role,
  User,
}

/*
  Models Association
*/

User.belongsTo(Role)
