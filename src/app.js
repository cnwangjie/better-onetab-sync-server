const conf = require('@cnwangjie/conf')
conf().load('../config.js').env()

const Koa = require('koa')
const mongoose = require('mongoose')
const bodyparser = require('koa-bodyparser')
const apiRouter = require('./api')
const authRouter = require('./auth')

mongoose.connect(conf.mongodb, {
  useNewUrlParser: true,
})

const app = module.exports = new Koa()
app.use(bodyparser())
app.use(async (ctx, next) => {
  Object.defineProperty(ctx, 'input', {
    get() {
      return Object.assign({}, ctx.body, ctx.query, ctx.params)
    }
  })
  return next()
})
app.use(async (ctx, next) => {
  const startTime = Date.now()
  let error
  try {
    await next()
  } catch (e) {
    error = e
  }
  console.log(`[${new Date().toLocaleString()}] ${ctx.method} ${ctx.path} (${ctx.status}) ${Date.now() - startTime}ms`)
  if (error) {
    console.log(`[input]:`, ctx.input)
    console.log(`[error]`, error)
  }
})
app.use(apiRouter.routes())
app.use(authRouter.routes())

