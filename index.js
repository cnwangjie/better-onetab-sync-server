const app = require('./src/app')
const socket = require('./src/socket')
const conf = require('@cnwangjie/conf')
const port = conf.port || 3000
const server = app.listen(port, () => {
  console.log('server is listening port:', port)
})
socket.attach(server, {
  path: '/ws',
})
