const rp = require('request-promise')
const conf = require('@cnwangjie/conf')

const client_id = conf.github.client_id
const client_secret = conf.github.client_secret

const generateAuthUrl = () => {
  return `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${conf.url + '/auth/github'}`
}

const getToken = async (code, state) => {
  const res = await rp({
    url: 'https://github.com/login/oauth/access_token',
    method: 'POST',
    form: {
      client_id,
      client_secret,
      code,
      state,
      redirect_uri: conf.url + '/auth/github',
    },
    headers: {
      'User-Agent': 'better-onetab-sync-server',
      'Accept': 'application/json',
    },
    json: true,
  })
  return res.access_token
}

const getUserInfoByAuthorizationCode = async (code, state) => {
  const token = await getToken(code, state)
  const info = await rp({
    url: 'https://api.github.com/user',
    headers: {
      'User-Agent': 'better-onetab-sync-server',
      'Authorization': `token ${token}`,
      'Accept': 'application/json',
    },
    json: true,
  })
  return info
}

module.exports = {
  generateAuthUrl,
  getUserInfoByAuthorizationCode,
}
