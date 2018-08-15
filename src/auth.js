const Router = require('koa-router')
const User = require('./schema/user')
const google = require('./service/google')
const jwt = require('./jwt')

const authRouter = module.exports = new Router({prefix: '/auth'})
authRouter.use(jwt.authMiddleware)
authRouter.get('/google', async ctx => {
  if (!ctx.input.code) {
    let redirectTo = google.generateAuthUrl()
    if (ctx.input.state) redirectTo += '&state=' + ctx.input.state
    ctx.redirect(redirectTo)
  } else {
    const {id} = await google.getUserInfoByAuthorizationCode(ctx.input.code)
    ctx.user = await User.findOne({googleId: id}) || await User.create({googleId: id})
    ctx.body = 'success'
    if (ctx.input.state && ctx.input.state.startsWith('ext:')) {
      const lend = ctx.input.state.substr(4)
      const token = jwt.genTokenForUser(ctx.user)
      const to = lend + '#' + token + '#'
      ctx.redirect(to)
    }
  }
})
