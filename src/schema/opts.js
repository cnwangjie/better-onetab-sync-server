const mongoose = require('mongoose')

const optsSchema = new mongoose.Schema({
  browserAction: {
    type: String,
    default: 'show-list',
  },
  itemClickAction: {
    type: String,
    default: 'open-and-remove',
  },
  popupItemClickAction: {
    type: String,
    default: 'restore',
  },
  removeItemBtnPos: {
    type: String,
    default: 'left',
  },
  addHistory: {
    type: Boolean,
    default: true,
  },
  ignorePinned: {
    type: Boolean,
    default: false,
  },
  pinNewList: {
    type: Boolean,
    default: false,
  },
  pageContext: {
    type: Boolean,
    default: true,
  },
  openTabListWhenNewTab: {
    type: Boolean,
    default: false,
  },
  syncOptions: {
    type: Boolean,
    default: true,
  },
  syncList: {
    type: Boolean,
    default: true,
  },
})

module.exports = { optsSchema }
