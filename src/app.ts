import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import router from './routes/index'
import models from './models/_instance'

require('dotenv').config()

const app = new Koa()
const port = process.env.PORT || '8000'

app.use(helmet())
app.use(cors())
app.use(logger())
app.use(bodyParser())

// Initial DB
models.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err)
  })

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, () => {
  console.log(`🚀 App listening on the port ${port}`)
})
