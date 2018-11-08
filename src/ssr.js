const nuxt = require('./nuxt')
const Router = require('koa-router')
const jwt = require('./jwt')

const ssrRouter = module.exports = new Router()

ssrRouter.use(jwt.authMiddleware)
ssrRouter.get('*', async (ctx, next) => {
  await next()
  if (!ctx.headerSent) {
    ctx.status = 200
    ctx.respond = false
    ctx.req.ctx = ctx
    nuxt.render(ctx.req, ctx.res)
  }
})
