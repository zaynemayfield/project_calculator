<template>
<div>
<h4>Welcome to Projects!</h4>
<p>This web app gives you the power to create projects and quote them completely out! Share them with friends and update the prices and materials</p>
<h3>Latest Public Projects</h3>
<div>
<h4 v-if="!projects.length">No projects yet</h4>
<ul v-if="projects.length">
  <li :key="index" v-for="(project, index) in projects">
      <!-- SHow avatar and make it a link to a page that a non-auth user can view -->
       <a href="" @click="goToPublicProject(project.id)"  ><h5>{{ project.name }} <br>
       {{ project.summary }}</h5></a>
       
       
       </li>
</ul>
</div>
</div>
</template>

<script>
import { inject, onMounted, ref } from 'vue'
export default {
  setup() {
    const apiClient = inject('$api', {})
    const projects = ref([])
    const getPublicProjects = async () => {
      projects.value = await apiClient.getPublicProjects()
    

    }

    onMounted(getPublicProjects)
    return {
      projects,
      goToPublicProject(id) {
        this.router.push({ name: 'View Project', Params: {projectId: id}})
      }
    }
  }
}
</script>