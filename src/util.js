const crypto = require('crypto')

const sha256 = str => crypto.createHash('sha256').update(str).digest()

const genUid = () => sha256(Date.now() + Math.random() + '').toString('hex').substr(0, 20)

const genToken = user => {
  const token = crypto.randomBytes(32)
  user.encryptedToken = sha256(token).toString('base64')
  return token.toString('base64')
}

const verifyToken = (user, token) => {
  return user.encryptedToken === sha256(token).toString('base64')
}

const detectAndParseJson = str => {
  if (typeof str !== 'string') return str
  try {
    return JSON.parse(str)
  } catch (error) {
    return str
  }
}

module.exports = {
  genUid,
  genToken,
  verifyToken,
  detectAndParseJson,
}
