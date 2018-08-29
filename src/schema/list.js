const mongoose = require('mongoose')
const { tabSchema } = require('./tab')

const listSchema = new mongoose.Schema({
  tabs: {
    type: [tabSchema],
    required: true,
  },
  title: {
    type: String,
    default: '',
    required: false,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  titleEditing: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  expand: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
  },
})

module.exports = { listSchema }
