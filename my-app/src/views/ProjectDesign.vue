<template>
    <div>

<!-- Project Details -->
        <div class="row mb-3">
            <div class="col"><strong>{{ project.name }}</strong> - {{ project.summary }} <i>({{ project.type }})</i></div>
        </div>
<!-- END Project Details -->

<!-- Create New Material is here ONLY SHOW WHEN NOT UPDATING MATERIAL -->
<!-- Create Line item when material is created -->
 <div class="card">
    <div class="card-body">
      <form enctype="application/x-www-form-urlencoded" @submit.prevent="createMaterial">
      <div class="row  align-items-center">
          <div class="col">
            <!-- NAME FIELD -->
          <input type="text" class="form-control" id="name" name="name" placeholder="Name" required />
        </div>
        <div class="col">
            <!-- URL FIELD -->
          <input type="url" class="form-control" id="url" name="url" placeholder="URL" />
        </div>
        <div class="col">
            <!-- DESCRIPTION FIELD -->
          <input type="text" class="form-control" id="description" name="description" placeholder="Description" />
        </div>
        <div class="col">
            <!-- PRICE FIELD -->
          <input type="number" class="form-control" min="0.00" step="0.01" id="price" name="price" placeholder="0.00" />
        </div>
        <div class="col">
            <!-- SUBMIT -->
            <button type="submit" class="btn btn-success">Add Material</button>
        </div>
    </div>
      </form>
    </div>
    </div>
<!-- END Create New Material -->

<!-- Update New Material is here ONLY SHOW WHEN CLICK EDIT MATERIAL -->
<!-- Update Material only -->
 <div class="card">
    <div class="card-body">
      
      <form enctype="application/x-www-form-urlencoded" @submit.prevent="updateMaterial">
      <div class="row align-items-center">
          <div class="col">
            <!-- NAME FIELD -->
          <input type="text" class="form-control" id="name" name="name" placeholder="Name" required />
        </div>
        <div class="col">
            <!-- URL FIELD -->
          <input type="url" class="form-control" id="url" name="url" placeholder="URL" />
        </div>
        <div class="col">
            <!-- DESCRIPTION FIELD -->
          <input type="text" class="form-control" id="description" name="description" placeholder="Description" />
        </div>
        <div class="col">
            <!-- PRICE FIELD -->
          <input type="number" class="form-control" min="0.00" step="0.01" id="price" name="price" placeholder="0.00" />
        </div>
        <div class="col">
            <!-- SUBMIT -->
            <button type="submit" class="btn btn-primary">Update Material</button>
        </div>
    </div>
      </form>
    </div>
    </div>
<!-- END Update New Material -->

    <hr>
<!-- Project Information -->
<div class="border rounded p-2">
    <div class="row">
        <div class="col">
            <h5>Project Info:</h5>
        </div>
        <div class="col">
            Total Project Cost:
        </div>
        <div class="col">
            Number of Items:
        </div>
    </div>
</div>

<!-- End Project Information -->

<!-- If no Materials -->
<div class="border rounded p-3">
    <h4>Create a Material to get started!</h4>
</div>
<!-- END no Materials -->

<!-- Line Item -->
<!-- Update line Item without clicking submit, just have it saved automatically -->
<div class="border rounded p-3">
    <!-- TOP ROW -->
        <div class="row  align-items-center mb-2">
            <!-- NAME -->
            <div class="col">
                material.name
            </div>

            <!-- URL -->
            <div class="col">
                material.url
            </div>

            <!-- DESCRIPTION -->
            <div class="col">
                material.description
            </div>

            <!-- EDIT MATERIAL -->
            <div class="col text-end">
                <button type="submit" class="btn btn-primary">Edit Material</button>
            </div>

            <!-- DELETE MATERIAL -->
            <div class="col">
                <button type="submit" class="btn btn-danger">Delete Material</button>
            </div>
        </div>
        <!-- BOTTOM ROW -->
        <div class="row  align-items-center">

            <!-- NOTES -->
            <div class="col">
                <input type="text" class="form-control" id="notes" name="notes" placeholder="Notes" value="lineItem.notes" />
            </div>
            
            <!-- PRICE -->
            <div class="col">
                material.price
            </div>

            <!-- QUANTITY -->
            <div class="col">
                <input type="number" class="form-control" min=".01" step="0.01" id="quantity" name="quantity" placeholder="1.00" value="lineItem.quantity" />
            </div>

            <!-- TOTAL -->
            <div class="col">
                $Total
            </div>

            <!-- DUPLICATE LINE ITEM -->
            <div class="col">
                <button type="submit" class="btn btn-success">Duplicate Item</button>
            </div>
        </div>
        </div>
<!-- END Line Item -->



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