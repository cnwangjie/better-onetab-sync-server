import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    uid: '',
  },
  mutations: {
    setUID(state, uid) {
      state.uid = uid
    },
  },
  actions: {
    nuxtServerInit({commit}, {req}) {
      if (req.ctx.user) commit('setUID', req.ctx.user.uid)
    },
  }
})

export default store
