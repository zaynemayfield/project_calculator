import { createStore } from 'vuex'

export default createStore({
  state: {
    errors: [],
    isLoggedIn: false,
    accessToken: '',
  },
  getters: {
    errors (state) {
      return state.errors
    },
    isLoggedIn (state) {
      return state.isLoggedIn
    },
    accessToken (state) {
      return state.accessToken
    }
  },
  mutations: {
    errors (state, payload) {
      state.errors = payload
    },
    isLoggedIn (state, payload) {
      state.isLoggedIn = payload
    },
    accessToken (state, payload) {
      state.accessToken = payload
    }
  },
  actions: {
    initializeAccessToken ({ commit }) {
      const accessToken = window.localStorage.getItem('accessToken')
      commit('accessToken', accessToken)
    },
    initializeIsLoggedIn ({ commit }) {
      const accessToken = window.localStorage.getItem('accessToken')
      if (accessToken) {
        commit('isLoggedIn', true)
      }
    }
  },
  modules: {
  }
})