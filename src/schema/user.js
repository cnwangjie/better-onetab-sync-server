const mongoose = require('mongoose')
const { optsSchema } = require('./opts')
const { listSchema } = require('./list')
const { genUid, genToken, verifyToken } = require('../util')

const userSchema = new mongoose.Schema({
  userOptions: {
    type: optsSchema,
    default: {},
  },
  lists: {
    type: [listSchema],
    default: [],
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
}, {
  timestamps: true,
  toObject: {
    getters: true,
    versionKey: false,
  }
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
