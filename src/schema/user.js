const mongoose = require('mongoose')
const { optsSchema } = require('./opts')
const { listSchema } = require('./list')
const { genUid, genToken, verifyToken } = require('../util')

const userSchema = new mongoose.Schema({
  opts: {
    type: optsSchema,
    default: {},
  },
  optsUpdatedAt: {
    type: Date,
    default: 0,
  },
  lists: {
    type: [listSchema],
    default: [],
  },
  listsUpdatedAt: {
    type: Date,
    default: 0,
  },
  uid: {
    type: String,
    default: genUid,
    unique: true,
    index: true,
  },
  encryptedToken: {
    type: String,
  },
  googleId: String,
  googleName: String,
  githubId: String,
  githubName: String,
}, {
  timestamps: true,
  toObject: {
    getters: true,
    versionKey: false,
  },
}).method({
  addList(list) {
    if (list._id && this.lists.id(list._id)) return
    this.lists.unshift(list)
  },
  updateListById(listId, newList) {
    const list = this.lists.id(listId)
    if (!list) return
    for (const [k, v] of Object.entries(newList)) {
      list[k] = v
    }
  },
  removeListById(listId) {
    this.lists.pull(listId)
  },
  changeListOrderRelatively(listId, diff) {
    if (diff === 0) return
    const list = this.lists.id(listId)
    if (!list) return
    const src = this.lists.indexOf(list)
    this.lists.pull(listId)
    this.lists.splice(src + diff, 0, list)
  },
  updateOpts(opts) {
    for (const [k, v] of Object.entries(opts)) {
      this.opts[k] = v
    }
  },
}).static({
  async genToken(uid) {
    const user = await this.findOne({uid})
    const token = genToken(user)
    await user.save()
    return token
  },
  async revokeToken(uid) {
    return this.findOneAndUpdate({uid}, {$unset: {encryptedToken}})
  },
  async verifyToken(uid, token) {
    const user = await this.findOne({uid})
    return verifyToken(user, token)
  },
})

const User = mongoose.model('user', userSchema)

module.exports = User
