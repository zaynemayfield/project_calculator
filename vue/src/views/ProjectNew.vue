<template>
  <div class="card">
    <div class="card-body">
      <h1 class="card-title">New Project</h1>
      <form enctype="multipart/form-data" @submit.prevent="handleNewProject">
        <div class="mb-3">
          <label for="name" class="form-label">Project Name</label>
          <input
            type="text"
            class="form-control"
            id="name"
            name="name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="Summary" class="form-label">Summary</label>
          <textarea
            class="form-control"
            id="summary"
            name="summary"
            rows="3"
            maxlength="1900"
          ></textarea>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="type"
            id="type1"
            value="Public"
            checked
          />
          <label class="form-check-label" for="type1"> Public </label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="type"
            id="type2"
            value="Private"
          />
          <label class="form-check-label" for="type2"> Private </label>
        </div>
        <div class="row align-items-center mt-3">
          <div class="col">
            <button type="submit" class="btn btn-primary">
              Create New Project
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { inject } from '@vue/runtime-core'
const apiClient = inject('$api', {})
const handleNewProject = (e) => {
  const data = new FormData(e.target)
  apiClient.newProject(data)
}

</script>
