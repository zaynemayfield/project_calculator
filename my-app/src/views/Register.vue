<template>
<div class="card">
<div class="card-body">
  <h1 class="card-title">Register</h1>
  <form enctype="multipart/form-data" @submit.prevent="handleRegister">
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" name="email" required>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password" required>
  </div>
  <div class="mb-3">
    <label class="form-label" for="avatar">Avatar</label>
    <input type="file" class="form-control" id="avatar" name="avatar" accept=".jpg,.jpeg,.png">
  </div>
  <div class="row align-items-center">
    <div class="col"><button type="submit" class="btn btn-primary">Register</button></div>
    <div class="col"><router-link :to="{ name: 'Log in' }">Existing user? Log in.</router-link></div>
  </div>
</form>
</div>
</div>
</template>

<script>
import { inject } from '@vue/runtime-core'
export default {
    setup() {
        const apiClient = inject('$api', {})
        return {
            handleRegister: (e) => {
                const data = new FormData(e.target)
                apiClient.register(data)
                }
            }
        }
    }
</script>