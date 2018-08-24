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
      return Object.assign({}, ctx.request.body, ctx.query, ctx.params)
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
  if (error || ctx.status >= 400) {
    if (ctx.input) console.log(`[input]:`, ctx.input)
    if (error) console.log(`[error]`, error)
    if (ctx.state) console.log(`[state]`, ctx.state)
    if (ctx.user) console.log(`[user]`, ctx.user)
  }
})
app.use(apiRouter.routes())
app.use(authRouter.routes())

