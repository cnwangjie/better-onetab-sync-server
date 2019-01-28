const mongoose = require('mongoose')

const optsSchema = new mongoose.Schema({
  browserAction: String,
  itemClickAction: String,
  popupItemClickAction: String,
  defaultNightMode: Boolean,
  itemDisplay: String,
  hideFavicon: Boolean,
  addHistory: Boolean,
  ignorePinned: Boolean,
  pinNewList: Boolean,
  pageContext: Boolean,
  allContext: Boolean,
  openTabListWhenNewTab: Boolean,
  alertRemoveList: Boolean,
  excludeIllegalURL: Boolean,
  removeDuplicate: Boolean,
  openEnd: Boolean,
  openTabListNoTab: Boolean,
  listsPerPage: String,
  titleFontSize: String,
  disableDynamicMenu: Boolean,
  disableExpansion: Boolean,
  disableTransition: Boolean,
  disableSearch: Boolean,
})

module.exports = { optsSchema }
