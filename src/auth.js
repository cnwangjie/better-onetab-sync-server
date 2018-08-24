const Router = require('koa-router')
const User = require('./schema/user')
const google = require('./service/google')
const github = require('./service/github')
const jwt = require('./jwt')

const authRouter = module.exports = new Router({prefix: '/auth'})
authRouter.use(jwt.authMiddleware)
authRouter.use(async (ctx, next) => {
  if (ctx.input.state) {
    const state = ctx.input.state.split(';').map(i => i.split(':')).reduce((r, [k, ...v]) => {
      r[k] = v.join(':')
      return r
    }, {})
    Object.assign(ctx.state, state)
  }
  return next()
})
authRouter.get('/google', async ctx => {
  if (!ctx.input.code) {
    let redirectTo = google.generateAuthUrl()
    if (ctx.input.state) redirectTo += '&state=' + ctx.input.state
    ctx.redirect(redirectTo)
  } else {
    const {id} = await google.getUserInfoByAuthorizationCode(ctx.input.code)
    if (ctx.state && ctx.state.uid) {
      ctx.user = await User.findOne({uid: ctx.state.uid})
      if (!ctx.user.googleId) {
        ctx.user.googleId = id
        await ctx.user.save()
      }
    } else {
      ctx.user = await User.findOne({googleId: id}) || await User.create({googleId: id})
    }
    ctx.body = 'success'
    if (ctx.state && ctx.state.ext) {
      const lend = ctx.state.ext
      const token = jwt.genTokenForUser(ctx.user)
      const to = lend + '#' + token + '#'
      ctx.redirect(to)
    }
  }
})

authRouter.get('/github', async ctx => {
  if (!ctx.input.code) {
    let redirectTo = github.generateAuthUrl()
    if (ctx.input.state) redirectTo += '&state=' + ctx.input.state
    ctx.redirect(redirectTo)
  } else {
    const {id} = await github.getUserInfoByAuthorizationCode(ctx.input.code, ctx.input.state)
    if (ctx.state && ctx.state.uid) {
      ctx.user = await User.findOne({uid: ctx.state.uid})
      if (!ctx.user.githubId) {
        ctx.user.githubId = id
        await ctx.user.save()
      }
    } else {
      ctx.user = await User.findOne({githubId: id}) || await User.create({githubId: id})
    }
    ctx.body = 'success'
    if (ctx.state && ctx.state.ext) {
      const lend = ctx.state.ext
      const token = jwt.genTokenForUser(ctx.user)
      const to = lend + '#' + token + '#'
      ctx.redirect(to)
    }
  }
})
