const _ = require('lodash')
const cors = require('koa2-cors')
const Router = require('koa-router')
const conf = require('@cnwangjie/conf')
const jwt = require('./jwt')
const { detectAndParseJson } = require('./util')

const apiRouter = module.exports = new Router({prefix: '/api'})
apiRouter.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowHeaders: [conf.jwt_header],
  exposeHeaders: [conf.jwt_header],
}))
apiRouter.options('*', ctx => {
  ctx.status = 200
  ctx.res.end()
})
apiRouter.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(error)
    if (error.status) ctx.status = error.status
    else ctx.status = 500
    ctx.body = { status: 'error', message: error.message }
  }
  if (!ctx.body) {
    if (ctx.status === 200) {
      ctx.body = { status: 'success' }
    } else {
      ctx.status = ctx.status || 404
      ctx.body = { status: 'error' }
    }
  }
})
const authorizeApiRouter = new Router()
authorizeApiRouter.use(jwt.authMiddleware)

/**
 * @api {get} /api/info 权限测试及更新token以及获取更新时间
 */
authorizeApiRouter.get('/info', async ctx => {
  if (ctx.user) ctx.body = _.pick(ctx.user, [
    'uid', 'listsUpdatedAt', 'optsUpdatedAt',
    'googleId', 'googleName', 'githubId', 'githubName',
  ])
})
/**
 * @api {get} /api/lists 获取所有列表
 */
authorizeApiRouter.get('/lists', async ctx => {
  if (ctx.user) ctx.body = ctx.user.lists
})
/**
 * @api {get} /api/opts 获取所有选项
 */
authorizeApiRouter.get('/opts', async ctx => {
  if (ctx.user) ctx.body = ctx.user.opts
})
/**
 * @api {put} /api/opts 设置所有选项
 */
authorizeApiRouter.put('/opts', async ctx => {
  if (ctx.user) {
    try {
      ctx.user.optsUpdatedAt = new Date()
      ctx.user.opts = detectAndParseJson(ctx.input.opts)
      await ctx.user.save()
      ctx.body = {optsUpdatedAt: ctx.user.optsUpdatedAt}
    } catch (error) {
      if (error.name === 'ValidationError') ctx.status = 400
      else ctx.status = 500
      throw error
    }
  }
})
/**
 * @api {post} /api/lists 设置列表
 */
authorizeApiRouter.put('/lists', async ctx => {
  if (ctx.user) {
    try {
      ctx.user.listsUpdatedAt = new Date()
      ctx.user.lists = detectAndParseJson(ctx.input.lists)
      await ctx.user.save()
      ctx.body = {listsUpdatedAt: ctx.user.listsUpdatedAt}
    } catch (error) {
      if (error.name === 'ValidationError') ctx.status = 400
      else ctx.status = 500
      throw error
    }
  }
})
apiRouter.use(authorizeApiRouter.routes())
