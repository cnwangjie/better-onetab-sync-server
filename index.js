const app = require('./src/app')
const conf = require('@cnwangjie/conf')
const port = conf.port || 3000
app.listen(port, () => {
  console.log('server is listening port:', port)
})
