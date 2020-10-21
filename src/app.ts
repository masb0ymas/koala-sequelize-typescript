import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import serve from 'koa-static'
import { koaSwagger } from 'koa2-swagger-ui'
import yaml2js from 'yamljs'
import _path from 'path'
import models from 'models/_instance'
import router from 'routes/index'

require('dotenv').config()

const app = new Koa()
const port = process.env.PORT || '8000'

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(cors())
app.use(logger())
app.use(bodyParser())
app.use(serve(_path.join(`${__dirname}/../`, 'public')))

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

// Generate Docs
const spec = yaml2js.load(_path.resolve('./docs/swagger/swagger-config.yaml'))

app.use(
  koaSwagger({
    routePrefix: '/v1/api-docs',
    swaggerOptions: { spec },
  })
)

app.listen(port, () => {
  console.log(`🚀 App listening on the port ${port}`)
})
