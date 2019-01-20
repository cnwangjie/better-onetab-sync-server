const _ = require('lodash')
const io = require('socket.io')()
const jwt = require('./jwt')
const conf = require('@cnwangjie/conf')
const User = require('./schema/user')

io.on('connection', socket => {
  const token = socket.handshake.query[conf.jwt_header]
  if (!jwt.verifyToken(token)) return socket.disconnect()
  const uid = jwt.decode(token).sub
  socket.join(uid)

  socket.on('list.update', async ({method, args}, cb) => {
    if (!(method in User.schema.methods)
      || args.length !== User.schema.methods[method].length) return cb({ err: 'args error' })

    const user = await User.findOne({uid})
    user[method](...args)
    user.listsUpdatedAt = new Date()
    try {
      await user.save()
      const result = { err: null }
      if (method === 'updateListById') {
        const updatedAt = Date.parse(user.lists.id(args[0]).updatedAt)
        result.updatedAt = updatedAt
        args[1].updatedAt = updatedAt
      }
      socket.to(uid).emit('list.update', {method, args})
      return cb(result)
    } catch (error) {
      return cb({ err: 'save err' })
    }
  })

  socket.on('list.all', async (cb) => {
    const user = await User.findOne({uid})
    const lists = user.lists.map(list => _.pick(list, ['_id', 'updatedAt']))
    cb(lists)
  })

  socket.on('list.get', async (id, cb) => {
    const user = await User.findOne({uid})
    const list = user.lists.id(id)
    cb(list)
  })

  socket.on('opts.all', async (cb) => {
    const user = await User.findOne({uid})
    cb(user.opts.toJSON())
  })

  socket.on('opts.set', async (obj, cb) => {
    const user = await User.findOne({uid})
    for (const [k, v] of Object.entries(obj)) {
      user.opts[k] = v
    }
    try {
      await user.save()
      socket.to(uid).emit('opts.set', obj)
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
