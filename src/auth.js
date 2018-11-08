const Router = require('koa-router')
const User = require('./schema/user')
const google = require('./service/google')
const github = require('./service/github')
const conf = require('@cnwangjie/conf')
const jwt = require('./jwt')

const authRouter = module.exports = new Router({prefix: '/auth'})

const oauthServices = { google, github }

authRouter.get('/', ctx => {
  console.log('!!!')
  ctx.state.token = 'token!!!'
  ctx.ssr('/auth', {req: ctx.req, res: ctx.res, token: 'token!!!!'})
})

authRouter.get('/:type', async ctx => {

  const {type} = ctx.params
  if (!Reflect.has(oauthServices, type)) return ctx.status = 404
  const oauth = oauthServices[type]

  const state = ctx.input.state ? ctx.input.state.split(';')
    .map(i => i.split(':'))
    .reduce((r, [k, ...v]) => {
      r[k] = v.join(':')
      return r
    }, {}) : {}

  if (!ctx.input.code) {
    let redirectTo = oauth.generateAuthUrl()
    if (ctx.input.state) redirectTo += '&state=' + ctx.input.state
    ctx.redirect(redirectTo)
  } else {
    const {id, name} = await oauth.getUserInfoByAuthorizationCode(ctx.input)

    const oauthIdKey = type + 'Id'
    const oauthNameKey = type + 'Name'
    if (state.uid) {
      ctx.user = await User.findOne({uid: state.uid})
      if (!ctx.user[oauthIdKey]) {
        ctx.user[oauthIdKey] = id
        await ctx.user.save()
      }
    } else {
      ctx.user = await User.findOne({[oauthIdKey]: id}) || await User.create({[oauthIdKey]: id})
    }

    if (ctx.user[oauthNameKey] !== name) {
      ctx.user[oauthNameKey] = name
      await ctx.user.save()
    }
    const token = jwt.genTokenForUser(ctx.user)
    if (state.ext) {
      const lend = state.ext
      const to = lend + '#' + token + '#'
      ctx.redirect(to)
    } else {
      ctx.cookies.set(conf.jwt_header, token, {
        maxAge: 3600 * 1000 * 24 * 30,
        httpOnly: false,
      })
      ctx.redirect('/success')
    }
  }
})
