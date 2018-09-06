const mongoose = require('mongoose')

const optsSchema = new mongoose.Schema({
  browserAction: String,
  itemClickAction: String,
  popupItemClickAction: String,
  removeItemBtnPos: String,
  addHistory: Boolean,
  ignorePinned: Boolean,
  pinNewList: Boolean,
  pageContext: Boolean,
  openTabListWhenNewTab: Boolean,
  defaultNightMode: Boolean,
  itemDisplay: String,
  hideFavicon: Boolean,
  fixedToolbar: Boolean,
  alertRemoveList: Boolean,
})

module.exports = { optsSchema }
