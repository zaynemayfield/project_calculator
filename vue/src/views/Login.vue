<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title">Log in</h1>
      <form
        enctype="application/x-www-form-urlencoded"
        @submit.prevent="handleLogin"
      >
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email"
            name="email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            name="password"
            required
          />
        </div>
        <div class="row align-items-center">
          <div class="col">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
          <div class="col">
            <router-link :to="{ name: 'Register' }"
              >New user? Register.</router-link
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { inject } from '@vue/runtime-core'
const apiClient = inject('$api', {})
const handleLogin = (e) => {
  const data = new FormData(e.target)
  apiClient.login(data)
}
</script>
