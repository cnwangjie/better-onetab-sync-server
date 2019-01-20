const _ = require('lodash')
const cors = require('koa2-cors')
const Router = require('koa-router')
const conf = require('@cnwangjie/conf')
const jwt = require('../jwt')
const socket = require('../socket')
const User = require('../schema/user')
const {detectAndParseJson} = require('../util')

const apiV2Router = module.exports = new Router({prefix: '/api/v2'})
apiV2Router.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowHeaders: [conf.jwt_header],
  exposeHeaders: [conf.jwt_header],
}))
apiV2Router.use(jwt.authMiddleware)
apiV2Router.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = { status: 'error' }
    ctx.status = err.status || 500
    if (err.message) ctx.body.message = err.message
  }
})
apiV2Router.post('/list', async ctx => {
  const user = ctx.user
  if (!user) ctx.throw(401)
  const list = detectAndParseJson(ctx.input.list)
  if (!list) ctx.throw(400, 'missing param `list`')
  user.addList(list)
  const validationErr = await user.lists.validateSync()
  if (validationErr) ctx.throw(400, validationErr)
  ctx.user.listsUpdatedAt = new Date()
  await user.save()
  socket.emitToUser(user.uid, 'list.update', { method: 'addList', args: [ list ] })
  ctx.body = user.lists[0].toJSON()
})
apiV2Router.put('/list/:listId', async ctx => {
  const user = ctx.user
  if (!user) ctx.throw(401)
  const newList = detectAndParseJson(ctx.input.list)
  if (!newList) ctx.throw(400, 'missing param `list`')
  const rawList = user.lists.id(ctx.input.listId)
  if (!rawList) ctx.throw(404, 'list not exists')
  user.updateListById(ctx.input.listId, newList)
  if (!rawList.isModified()) {
    const validationErr = rawList.validateSync()
    if (validationErr) ctx.throw(400, validationErr)
  }
  ctx.user.listsUpdatedAt = new Date()
  await user.save()
  socket.emitToUser(user.uid, 'list.update', { method: 'updateListById', args: [ ctx.input.listId, newList ] })
  ctx.body = rawList.toJSON()
})
apiV2Router.delete('/list/:listId', async ctx => {
  const user = ctx.user
  if (!user) ctx.throw(401)
  const list = user.lists.id(ctx.input.listId)
  if (!list) ctx.throw(404, 'list not exists')
  user.removeListById(ctx.input.listId)
  ctx.user.listsUpdatedAt = new Date()
  await user.save()
  socket.emitToUser(user.uid, 'list.update', { method: 'removeListById', args: [ ctx.input.listId ] })
  ctx.body = {status: 'success'}
})
apiV2Router.post('/list/:listId/order', async ctx => {
  const user = ctx.user
  if (!user) ctx.throw(401)
  const list = user.list.id(ctx.input.listId)
  if (!list) ctx.throw(404, 'list not exists')
  const diff = ctx.input.diff
  if (diff == null) ctx.throw(400, 'missing param `diff`')
  if (!isFinite(+diff)) ctx.throw(400, 'bad param `diff`')
  user.changeListOrderRelatively(ctx.input.listId, +diff)
  if (!rawList.isModified()) {
    const validationErr = rawList.validateSync()
    if (validationErr) ctx.throw(400, validationErr)
  }
  ctx.user.listsUpdatedAt = new Date()
  await user.save()
  socket.emitToUser(user.uid, 'list.update', { method: 'changeListOrderRelatively', args: [ ctx.input.listId, +diff ] })
  ctx.body = {status: 'success'}
})
apiV2Router.post('/lists/bulk', async ctx => {
  const user = ctx.user
  if (!user) ctx.throw(401)
  const changes = detectAndParseJson(ctx.input.changes)
  if (!Array.isArray(changes)) ctx.throw(400, '`changes must be an array`')
  for (const [method, ...args] of changes) {
    if (!(method in User.schema.methods)
      || args.length !== User.schema.methods[method].length) ctx.throw(400)
    user[method](...args)
  }
  ctx.user.listsUpdatedAt = new Date()
  await user.save()
  for (const [method, ...args] of changes) {
    socket.emitToUser(user.uid, 'list.update', { method, args })
  }
  ctx.body = {status: 'success', listsUpdatedAt: user.listsUpdatedAt}
})
apiV2Router.put('/opts', async ctx => {
  const user = ctx.user
  if (!user) ctx.throw(401)
  const opts = detectAndParseJson(ctx.input.opts)
  if (!opts) ctx.throw(400, 'missing param `opts`')
  user.updateOpts(opts)
  user.optsUpdatedAt = new Date()
  await user.save()
  socket.emitToUser(user.uid, 'opts.set', opts)
  ctx.body = {status: 'success', optsUpdatedAt: user.optsUpdatedAt}
})
apiV2Router.all('*', async ctx => {
  ctx.body = 'ok'
})
