import axios from 'axios'

const prepare = context => {
  let token
  if (process.client) {
    token = localStorage._BOSS_TOKEN
  } else if (process.server) {
    token = context.req.ctx.cookies.get('auth')
  }
  return axios.create({
    withCredentials: true,
    baseURL: 'http://127.0.0.1:3000',
    headers: {
      auth: token,
    }
  })
}

export default prepare
