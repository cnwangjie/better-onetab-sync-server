const conf = require('@cnwangjie/conf')
conf().load('../config.js').env()

const Koa = require('koa')
const mongoose = require('mongoose')
const bodyparser = require('koa-bodyparser')
const apiRouter = require('./api')
const apiV2Router = require('./api/v2')
const ssrRouter = require('./ssr')
const authRouter = require('./auth')
const crypto = require('crypto')
const logger = require('./logger')
const Sentry = require('@sentry/node')

mongoose.connect(conf.mongodb, {
  useCreateIndex: true,
  useNewUrlParser: true,
})

const app = module.exports = new Koa()
app.on('error', err => {
  logger.log(err)
})
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
  const time = Date.now() - startTime
  console.log(`[${new Date().toLocaleString()}] ${id} -> (${ctx.status}) +${time}ms\n`)
  Sentry.withScope(scope => {
    scope.setTag('status', ctx.status)
    scope.setTag('url', ctx.request.originalUrl)
    scope.setTag('time', time)
    if (ctx.user) scope.setUser({id: ctx.user.uid, ip_address: ctx.request.ip})

    if (error || ctx.status >= 400) {
      Sentry.withScope(scope => {
        if (ctx.state) scope.setExtra('state', ctx.state)
        if (ctx.input) scope.setExtra('input', ctx.input)
        if (error) {
          Sentry.captureException(error)
        } else {
          Sentry.captureMessage(ctx.body)
        }
      })
    }
  })
})
app.use(apiV2Router.routes())
app.use(apiRouter.routes())
app.use(authRouter.routes())
app.use(ssrRouter.routes())
