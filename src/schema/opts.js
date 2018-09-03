const mongoose = require('mongoose')

const optsSchema = new mongoose.Schema({
  browserAction: {
    type: String,
  },
  itemClickAction: {
    type: String,
  },
  popupItemClickAction: {
    type: String,
  },
  removeItemBtnPos: {
    type: String,
  },
  addHistory: {
    type: Boolean,
  },
  ignorePinned: {
    type: Boolean,
  },
  pinNewList: {
    type: Boolean,
  },
  pageContext: {
    type: Boolean,
  },
  openTabListWhenNewTab: {
    type: Boolean,
  },
  defaultNightMode: {
    type: Boolean,
  },
  itemDisplay: {
    type: String,
  },
  hideFavicon: {
    type: Boolean,
  },
  fixedToolbar: {
    type: Boolean,
  },
})

module.exports = { optsSchema }
