<template>
<ul>
  <li :key="index" v-for="(project, index) in projects">{{ project.name }}</li>
</ul>
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
