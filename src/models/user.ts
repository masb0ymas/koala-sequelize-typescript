import { Model, Optional, DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import SequelizeAttributes from 'utils/SequelizeAttributes'
import schemaUser from 'controllers/User/schema'
import db from './_instance'

export interface UserAttributes {
  id: string
  fullName: string
  email: string
  password?: string
  phone: string
  active?: boolean | null
  tokenVerify?: string | null
  newPassword?: string
  confirmNewPassword?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TokenAttributes {
  data: UserAttributes
  message: string
}

export interface LoginAttributes {
  email: string
  password: string
}

export interface EmailAttributes {
  email: string
  fullName: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  comparePassword(): Promise<boolean | void>
}

const User = db.sequelize.define<UserInstance>(
  'Users',
  {
    ...SequelizeAttributes.Users,
    newPassword: {
      type: DataTypes.VIRTUAL,
    },
    confirmNewPassword: {
      type: DataTypes.VIRTUAL,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['password', 'tokenVerify'],
      },
    },
    scopes: {
      withPassword: {},
    },
  }
)

function setUserPassword(instance: UserInstance) {
  const { newPassword, confirmNewPassword } = instance
  const fdPassword = { newPassword, confirmNewPassword }
  const validPassword = schemaUser.createPassword.validateSyncAt(
    'confirmNewPassword',
    fdPassword
  )
  const saltRounds = 10
  const hash = bcrypt.hashSync(validPassword, saltRounds)
  instance.setDataValue('password', hash)
}

User.addHook('beforeCreate', setUserPassword)
User.addHook('beforeUpdate', (instance: UserInstance) => {
  const { newPassword, confirmNewPassword } = instance
  if (newPassword || confirmNewPassword) {
    setUserPassword(instance)
  }
})

// Compare password
User.prototype.comparePassword = function (candidatePassword: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: 'RoleId' })
}

export default User
