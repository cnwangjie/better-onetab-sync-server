const _ = require('lodash')
const io = require('socket.io')()
const jwt = require('./jwt')
const conf = require('@cnwangjie/conf')
const User = require('./schema/user')
const logger = require('./logger')

io.on('connection', socket => {
  const token = socket.handshake.query[conf.jwt_header]
  if (!jwt.verifyToken(token)) return socket.disconnect()
  const uid = jwt.decode(token).sub
  socket.on('error', error => {
    logger.log(error)
  })
  socket.join(uid)

  socket.on('list.time', async cb => {
    const user = await User.findOne({uid})
    cb(user.listsUpdatedAt.valueOf())
  })

  socket.on('list.update', async ({method, args}, cb) => {
    if (!(method in User.schema.methods)
      || args.length !== User.schema.methods[method].length) return cb({ err: 'args error' })

    const user = await User.findOne({uid})
    user[method](...args)
    user.listsUpdatedAt = new Date()
    try {
      await user.save()
      const result = { err: null }
      socket.to(uid).emit('list.update', {method, args})
      return cb(result)
    } catch (error) {
      return cb({ err: 'save err' })
    }
  })

  socket.on('list.all', async cb => {
    const user = await User.findOne({uid})
    const lists = user.lists.map(list => _.pick(list, ['_id', 'updatedAt']))
    cb(lists)
  })

  socket.on('list.get', async (id, cb) => {
    const user = await User.findOne({uid})
    const list = user.lists.id(id)
    cb(list)
  })

  socket.on('opts.time', async cb => {
    const user = await User.findOne({uid})
    cb(user.optsUpdatedAt.valueOf())
  })

  socket.on('opts.all', async cb => {
    const user = await User.findOne({uid})
    cb(user.opts.toJSON())
  })

  socket.on('opts.set', async ({opts, time}, cb) => {
    const user = await User.findOne({uid})
    if (time > Date.now() || time < user.optsUpdatedAt.valueOf())
      return cb({ err: 'invalid time' })

    for (const [k, v] of Object.entries(opts)) {
      user.opts[k] = v
    }
    user.optsUpdatedAt = time
    try {
      await user.save()
      socket.to(uid).emit('opts.set', {opts, time})
      return cb({ err: null })
    } catch (error) {
      return cb({ err: 'save err' })
    }
  })
})

const emitToUser = (uid, event, data) => {
  process.nextTick(() => {
    io.sockets.in(uid).emit(event, data)
  })
}

io.emitToUser = emitToUser

module.exports = io
