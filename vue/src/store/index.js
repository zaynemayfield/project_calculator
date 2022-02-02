import { createStore } from 'vuex'

export default createStore({
  state: {
    errors: []
  },
  getters: {
    errors (state) {
      return state.errors
    }
  },
  mutations: {
    errors (state, payload) {
      state.errors = payload
    }
  },
  modules: {
  }
})
