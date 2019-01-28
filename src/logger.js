const conf = require('@cnwangjie/conf')
const Sentry = require('@sentry/node')
const os = require('os')

const logger = module.exports = {}
Sentry.init({
  debug: process.env.NODE_ENV === 'development',
  environment: process.env.NODE_ENV,
  dsn: conf.sentry_dsn,
  serverName: os.hostname(),
})

logger.log = (...args) => {
  console.log(...args)
  args.forEach(arg => {
    if ((arg instanceof Error) || arg && arg.message) Sentry.captureException(arg)
    else if (args != null) Sentry.captureMessage(arg)
  })
}
