const mongoose = require('mongoose')

const tabSchema = new mongoose.Schema({
  favIconUrl: String,
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: '',
  },
  pinned: {
    type: Boolean,
    default: false,
  }
})

module.exports = { tabSchema }
