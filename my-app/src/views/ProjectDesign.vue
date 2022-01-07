<template>
    <div>
        <div class="row">
            <div class="col">{{ project.name }}</div>
            <div class="col">{{ project.summary }}</div>
        </div>

    </div>
</template>

<script>
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
export default {
    setup() {
        const route = useRoute();
        const projectId = route.params.id
        console.log(projectId)
        const apiClient = inject('$api', {})
        const project = ref([])
        const getProject = async () => {
        project.value = await apiClient.getProject(projectId)
        }
        onMounted(getProject)
        return {
            project,
        }
}
}
</script>