const mongoose = require('mongoose')

const optsSchema = new mongoose.Schema({
  browserAction: String,
  itemClickAction: String,
  popupItemClickAction: String,
  removeItemBtnPos: String,
  defaultNightMode: Boolean,
  itemDisplay: String,
  hideFavicon: Boolean,
  fixedToolbar: Boolean,
  addHistory: Boolean,
  ignorePinned: Boolean,
  pinNewList: Boolean,
  pageContext: Boolean,
  allContext: Boolean,
  openTabListWhenNewTab: Boolean,
  alertRemoveList: Boolean,
  excludeIllegalURL: Boolean,
  removeDuplicate: Boolean,
  enableSearch: Boolean,
  openEnd: Boolean,
})

module.exports = { optsSchema }
