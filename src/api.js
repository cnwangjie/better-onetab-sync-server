const cors = require('koa2-cors')
const Router = require('koa-router')
const conf = require('@cnwangjie/conf')
const User = require('./schema/user')
const jwt = require('./jwt')
const { detectAndParseJson } = require('./util')

const apiRouter = module.exports = new Router({prefix: '/api'})
apiRouter.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowHeaders: [conf().jwt_header]
}))
apiRouter.options('*', ctx => {
  ctx.status = 200
})
apiRouter.use(async (ctx, next) => {
  await next()
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
// const authorize = async (ctx, next) => {
//   // TODO: change with jwt
//   do {
//     const uid = ctx.input.uid
//     if (!uid) break
//     const token = ctx.header.token || ctx.input.token
//     if (!token) break
//     const user = User.findOne({uid})
//     if (!user) break
//     if (!User.verifyToken(user, token)) break
//     ctx.user = user
//     return next()
//   } while (0)
//   ctx.user = null
//   next()
// }
// authorizeApiRouter.use(authorize)
authorizeApiRouter.use(jwt.authMiddleware)

/**
 * @api {get} /api/info 权限测试及更新token以及获取更新时间
 */
authorizeApiRouter.get('/info', async ctx => {
  if (ctx.user) ctx.body = {
    uid: ctx.user.uid,
    updatedAt: ctx.user.updatedAt
  }
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
  if (ctx.user) ctx.body = ctx.user.userOptions
})
/**
 * @api {put} /api/opts 设置所有选项
 */
authorizeApiRouter.put('/opts', async ctx => {
  if (ctx.user) {
    try {
      ctx.user.userOptions = detectAndParseJson(ctx.input.opts)
      await ctx.user.save()
      ctx.status = 200
    } catch (error) {
      if (error.name === 'ValidationError') ctx.status = 400
      else ctx.status = 500
      throw error
    }
  }
})
/**
 * @api {delete} /api/lists/:listIndex 删除一个列表
 */
authorizeApiRouter.delete('/lists/:listIndex', async ctx => {
  if (!isFinite(ctx.input.listIndex)) {
    ctx.status = 400
  } else if (!ctx.user || ctx.user.listIndex >= ctx.user.list.length) {
  } else {
    ctx.user.removeList(ctx.listIndex)
    await ctx.user.save()
    ctx.status = 200
  }
})
/**
 * @api {post} /api/lists 添加一个列表
 */
authorizeApiRouter.post('/lists', async ctx => {
  if (ctx.user) {
    try {
      ctx.user.addList(detectAndParseJson(ctx.input.list))
      await ctx.user.save()
      ctx.status = 200
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
      ctx.user.lists = detectAndParseJson(ctx.input.lists)
      await ctx.user.save()
      ctx.status = 200
    } catch (error) {
      if (error.name === 'ValidationError') ctx.status = 400
      else ctx.status = 500
      throw error
    }
  }
})
apiRouter.use(authorizeApiRouter.routes())
