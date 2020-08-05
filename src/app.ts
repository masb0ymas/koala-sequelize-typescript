import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import * as helmet from 'koa-helmet'

const app = new Koa()
const port = process.env.PORT || '8000'

app.use(helmet())
app.use(cors())
app.use(bodyParser())

app.listen(port, () => {
  console.log(`🚀 App listening on the port ${port}`)
})
