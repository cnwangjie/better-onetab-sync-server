module.exports = {
  dev: false,
  srcDir: 'src/web/',
  plugins: [
    '~/plugins/vuetify.js',
  ],
  css: [
    'vuetify/dist/vuetify.min.css',
    'material-design-icons-iconfont/dist/material-design-icons.css',
  ],
  loading: { color: '#3B8070' },
  head: {
    meta: [
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { 'http-equiv': 'X-UA-Compatible', content: 'ie=edge' },
    ]
  }
}
