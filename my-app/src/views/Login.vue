<template>
<div class="card">
<div class="card-body">
  <h1 class="card-title">Log in</h1>
  <form>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" name="email" required>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" name="password" required>
  </div>
  <div class="row align-items-center">
  <div class="col"><button type="submit" class="btn btn-primary">Login</button></div>
  <div class="col"><router-link :to="{ name: 'Register' }">New user? Register.</router-link></div>
  </div>
</form>
</div>
</div>
</template>
