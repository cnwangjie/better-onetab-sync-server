const mongoose = require('mongoose')
const { tabSchema } = require('./tab')

const listSchema = new mongoose.Schema({
  tabs: {
    type: [tabSchema],
  },
  title: {
    type: String,
    default: '',
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
  },
  updatedAt: {
    type: Date,
  },
}).pre('save', async function () {
  if (this.tabs.length === 0) return this.remove()
})

module.exports = { listSchema }
