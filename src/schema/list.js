const mongoose = require('mongoose')
const { tabSchema } = require('./tab')

const listSchema = new mongoose.Schema({
  tabs: {
    type: [tabSchema],
    required() {
      return this.tabs.length > 0
    },
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
})

module.exports = { listSchema }
