const conf = require('@cnwangjie/conf')
conf().load('../config.js').env()

const Koa = require('koa')
const mongoose = require('mongoose')
const bodyparser = require('koa-bodyparser')
const apiRouter = require('./api')
const apiV2Router = require('./api/v2')
const authRouter = require('./auth')
const crypto = require('crypto')

mongoose.connect(conf.mongodb, {
  useCreateIndex: true,
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
  await next()
})
app.use(async (ctx, next) => {
  const startTime = Date.now()
  const id = crypto.randomBytes(3).toString('hex')
  let error
  console.log(`[${new Date().toLocaleString()}] ${id} <- ${ctx.method} ${ctx.path} `)
  try {
    await next()
  } catch (e) {
    error = e
  }
  console.log(`[${new Date().toLocaleString()}] ${id} -> (${ctx.status}) +${Date.now() - startTime}ms\n`)
  if (error || ctx.status >= 400) {
    if (ctx.input) console.log(`[input]:`, ctx.input)
    if (error) console.log(`[error]`, error)
    if (ctx.state) console.log(`[state]`, ctx.state)
    if (ctx.user) console.log(`[user]`, ctx.user)
  }
})
app.use(async (ctx, next) => {
  if (ctx.path === '/') ctx.body = 'ok'
  await next()
})
app.use(apiV2Router.routes())
app.use(apiRouter.routes())
app.use(authRouter.routes())

