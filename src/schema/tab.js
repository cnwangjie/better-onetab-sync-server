const mongoose = require('mongoose')

const tabSchema = new mongoose.Schema({
  favIconUrl: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  pinned: {
    type: Boolean,
    default: false,
  }
})

module.exports = { tabSchema }
