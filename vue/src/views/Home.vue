<template>
<div>


<div class="row">

  <div class="col">
    <h4 v-if="!projects.length">No Projects Yet</h4>
    <h4 v-if="projects.length">Your Projects</h4>
  </div>

  <div class="col">
    <button type="button" class="btn btn-primary" @click="redirect('New Project','')">Create New Project</button>
  </div>

</div>

<ul v-if="projects.length">
  <!-- make the link clickable -->
  <li :key="index" v-for="(project, index) in projects"> <a href="" @click.prevent="redirect('Design Project', project.id)"> <strong>{{ project.name }}</strong> - {{ project.summary }}</a></li>
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
      projects,
      redirect: (name, param) => {
        apiClient.redirect(name, param)
      }
    }
  }
}
</script>
