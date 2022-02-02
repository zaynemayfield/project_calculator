<template>
  <div>
    <h4>Welcome to Projects!</h4>
    <p>
      This web app gives you the power to create projects and quote them
      completely out! Share them with friends and update the prices and
      materials
    </p>
    <h3>Latest Public Projects</h3>
    <div>
      <h4 v-if="!projects.length">No projects yet</h4>
      <ul v-if="projects.length">
        <li :key="index" v-for="(project, index) in projects">
          <!-- SHow avatar and make it a link to a page that a non-auth user can view -->
          <a href="" @click.prevent="redirect('View Project', project.id)"
            ><strong>{{ project.name }} </strong> - {{ project.summary }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
const apiClient = inject('$api', {})
const projects = ref([])
const getPublicProjects = async () => {
  projects.value = await apiClient.getPublicProjects()
}
onMounted(getPublicProjects)
const redirect = (name, param) => {
  apiClient.redirect(name, param)
}

</script>
