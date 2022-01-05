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
  <textarea class="form-control" id="summary" name="summary" rows="3" maxlength="1900"></textarea>

        </div>
        <div class="row align-items-center">
          <div class="col">
            <button type="submit" class="btn btn-primary">Create New Project</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { inject } from "@vue/runtime-core"
export default {
  setup() {
    const apiClient = inject("$api", {})
    return {
      handleNewProject: (e) => {
        const data = new FormData(e.target)
        apiClient.newProject(data)
      }
    }
  }
}
</script>