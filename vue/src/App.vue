<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link :to="{ name: 'Landing' }" class="navbar-brand"
          >Project Calculator</router-link
        >
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
            <!-- Only show this if user is logged in -->
            <li v-if="$store.state.isLoggedIn" class="nav-item">
              <router-link
                class="nav-link"
                active-class="active"
                :to="{ name: 'Home' }"
                >
                  Home
                </router-link>
            </li>

            <!-- Do not show if user is logged in -->
            <li v-if="!$store.state.isLoggedIn" class="nav-item">
              <router-link
                class="nav-link"
                active-class="active"
                :to="{ name: 'Login' }"
                >
                  Login / Signup
                </router-link
              >
            </li>
            <li v-if="$store.state.isLoggedIn" class="nav-item">
              <a href="#" @click.prevent="handleLogout()" class="nav-link">Logout</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container pt-3">
      <div
        :key="index"
        v-for="(error, index) in store.getters.errors"
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        {{ error.message }}
        <button
          @click="dismissError(index)"
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { inject } from '@vue/runtime-core'
const apiClient = inject('$api', {})
const store = useStore()
store.dispatch('initializeAccessToken')
store.dispatch('initializeIsLoggedIn')
const handleLogout = () => {
  apiClient.logout()
}
const dismissError = (index) => {
  const errors = store.getters.errors
  errors.splice(index, 1)
  store.commit('errors', errors)
}
</script>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>
