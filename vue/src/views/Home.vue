<template>
  <div>
    <div class="row">
      <div class="col">
        <h4 v-if="!projects.length">No Projects Yet</h4>
        <h4 v-if="projects.length">Your Projects</h4>
      </div>

      <div class="col">
        <router-link :to="{ name: 'New Project'}">
          <button
            type="button"
            class="btn btn-primary"
          >
            Create New Project
          </button>
        </router-link>
      </div>
    </div>

    <ul v-if="projects.length">
      <!-- make the link clickable -->
      <li :key="index" v-for="(project, index) in projects">
        <router-link :to="{ name: 'Design Project', params: { id: project.id } }">
          <strong>{{ project.name }}</strong> - {{ project.summary }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
const apiClient = inject('$api', {})
const projects = ref([])
const getProjects = async () => {
  projects.value = await apiClient.getProjects()
}
onMounted(getProjects)
</script>
