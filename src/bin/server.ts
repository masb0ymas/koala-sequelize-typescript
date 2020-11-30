import fs from 'fs'
import path from 'path'
import models from 'models/_instance'

const pathEnv = path.resolve('.env')

if (!fs.existsSync(pathEnv)) {
  throw new Error(
    'Missing env!!!\nCopy / Duplicate ".env.example" root directory to ".env"'
  )
}

// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({ extensions: ['.js', '.ts'] })

require('dotenv').config()
const app = require('../app')

const port = process.env.PORT || '8000'

// Initial DB
models.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err)
  })

app.listen(port, () => {
  console.log(`🚀 App listening on the port ${port}`)
})
