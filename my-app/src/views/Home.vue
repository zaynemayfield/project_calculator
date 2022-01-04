<template>
<div>

    <router-link :to="{ name: 'New Project' }">New Project</router-link>

<h4 v-if="!projects.length">No Projects Yet</h4>
<h4 v-if="projects.length">Your Projects</h4>
<ul v-if="projects.length">
  <!-- make the link clickable -->
  <li :key="index" v-for="(project, index) in projects">{{ project.name }}</li>
</ul>
</div>
</template>

<script>
import { inject, onMounted, ref } from 'vue'
export default {
  setup() {
    const apiClient = inject('$api', {})
    const projects = ref([])
    const getProjects = async () => {
      projects.value = await apiClient.getProjects()
    }
    onMounted(getProjects)
    return {
      projects
    }
  }
}
</script>
