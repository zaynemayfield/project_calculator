<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Project Calculator</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="/login">Log in</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container pt-3">
      <div :key="index" v-for="(error, index) in store.getters.errors" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error.message }}
        <button @click="dismissError(index)" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    return {
      store,
      dismissError: (index) => {
        const errors = store.getters.errors
        errors.splice(index, 1)
        store.commit('errors', errors)
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../node_modules/bootstrap/scss/bootstrap.scss'
</style>