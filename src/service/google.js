const { google } = require('googleapis')
const conf = require('@cnwangjie/conf')
const scope = ['profile', 'openid']
const createNewOauth2Client = () => new google.auth.OAuth2(
  conf.google.client_id,
  conf.google.client_secret,
  conf.url + '/auth/google'
)
// refer: https://github.com/google/google-api-nodejs-client/#oauth2-client
const generateAuthUrl = () => createNewOauth2Client().generateAuthUrl({scope})
const getUserInfoByAuthorizationCode = async authorizationCode => {
  const auth = createNewOauth2Client()
  const {tokens} = await auth.getToken(authorizationCode)
  auth.setCredentials(tokens)
  const oauth2 = google.oauth2('v2')
  oauth2._options.auth = auth
  // refer: https://google.github.io/google-api-nodejs-client/classes/_apis_oauth2_v2_.resource_userinfo.html
  const result = await oauth2.userinfo.get()
  return result.data
}

module.exports = { generateAuthUrl, getUserInfoByAuthorizationCode }
