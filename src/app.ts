import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import serve from 'koa-static'
import { koaSwagger } from 'koa2-swagger-ui'
import yaml2js from 'yamljs'
import _path from 'path'
import router from 'routes/index'

const app = new Koa()

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)
app.use(cors())
app.use(logger())
app.use(bodyParser())
app.use(serve(_path.join(`${__dirname}/../`, 'public')))

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

module.exports = app
