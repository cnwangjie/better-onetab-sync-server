const {Nuxt, Builder} = require('nuxt')
const nuxtConfig = require('../nuxt.config')
const isProd = process.env.NODE_ENV === 'production'
nuxtConfig.dev = !isProd
const nuxt = module.exports = new Nuxt(nuxtConfig)

if (!isProd) {
  const builder = new Builder(nuxt)
  builder.build()
}
