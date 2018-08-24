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
  googleEmail: String,
  githubId: String,
  githubName: String,
}, {
  timestamps: true,
  toObject: {
    getters: true,
    versionKey: false,
  },
}).method({
  async addList(list) {
    this.lists.unshift(list)
    return this.save()
  },
  async removeList(listIndex) {
    this.lists.splice(listIndex, 1)
    return this.save()
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
