<template>
  <div>
    <!-- Project Details -->
    <div class="row mb-3" id="editMaterial">
      <div class="col">
        <h3>
          <strong>{{ project.name }}</strong> - {{ project.summary }}
          <i>({{ project.type }})</i>
        </h3>
      </div>
    </div>
    <!-- END Project Details -->

    <!-- Create New Material is here ONLY SHOW WHEN NOT UPDATING MATERIAL -->
    <!-- Create Line item when material is created -->
    <div class="card" v-if="!showEditMaterialForm">
      <div class="card-body">
        <form enctype="multipart/form-data" @submit.prevent="createMaterial">
          <div class="row align-items-center">
            <div class="col">
              <!-- NAME FIELD -->
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                placeholder="Name"
                required
              />
            </div>
            <div class="col">
              <!-- URL FIELD -->
              <input
                type="url"
                class="form-control"
                id="url"
                name="url"
                placeholder="URL"
              />
            </div>
            <div class="col">
              <!-- DESCRIPTION FIELD -->
              <input
                type="text"
                class="form-control"
                id="description"
                name="description"
                placeholder="Description"
              />
            </div>
            <div class="col">
              <!-- PRICE FIELD -->
              <input
                type="number"
                class="form-control"
                min="0.00"
                step="0.01"
                id="price"
                name="price"
                placeholder="0.00"
              />
            </div>
            <div class="col">
              <input type="hidden" name="project_id" :value="project.id" />
              <!-- SUBMIT -->
              <button type="submit" class="btn btn-success">
                Add Material
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- END Create New Material -->

    <!-- Update New Material is here ONLY SHOW WHEN CLICK EDIT MATERIAL -->
    <!-- Update Material only -->
    <div class="card shadow" v-if="showEditMaterialForm">
      <div class="card-body">
        <form
          enctype="application/x-www-form-urlencoded"
          @submit.prevent="updateMaterial"
        >
          <div class="row align-items-center">
            <div class="col">
              <!-- NAME FIELD -->
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                placeholder="Name"
                :value="updatedMaterial.material.name"
                required
              />
            </div>
            <div class="col">
              <!-- URL FIELD -->
              <input
                type="url"
                class="form-control"
                id="url"
                name="url"
                placeholder="URL"
                :value="updatedMaterial.material.url"
              />
            </div>
            <div class="col">
              <!-- DESCRIPTION FIELD -->
              <input
                type="text"
                class="form-control"
                id="description"
                name="description"
                placeholder="Description"
                :value="updatedMaterial.material.description"
              />
            </div>
            <div class="col">
              <!-- PRICE FIELD -->
              <input
                type="number"
                class="form-control"
                min="0.00"
                step="0.01"
                id="price"
                name="price"
                placeholder="0.00"
                :value="updatedMaterial.material.price"
              />
            </div>
            <div class="col">
              <input
                type="hidden"
                name="id"
                :value="updatedMaterial.material_id"
              />
              <!-- SUBMIT -->
              <button type="submit" class="btn btn-primary">
                Update Material
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- END Update New Material -->

    <hr />
    <!-- Project Information -->
    <div class="border rounded p-2" id="checkDelete">
      <div class="row">
        <div class="col">
          <h5>Project Info:</h5>
        </div>
        <div class="col">Total Project Cost: {{ totalProjectCost() }}</div>
        <div class="col">
          Number of Items: {{ lineItemsWithMaterials.length }}
        </div>
      </div>
    </div>

    <!-- End Project Information -->

    <!-- Check if user really wants to delete the material. -->
    <div class="alert alert-danger" role="alert" v-if="showCheckDeleteForm">
      Are you sure you want to delete material? Any items associated with this
      material will be deleted in this project. <br />
      {{ checkDeleteMaterial.material.name }} -
      {{ checkDeleteMaterial.material.description }} <br />
      <div class="row mt-2">
        <div class="col-auto">
          <button
            type="submit"
            class="btn btn-success"
            @click="showCheckDeleteForm = false"
          >
            No, Cancel Delete
          </button>
        </div>
        <div class="col-auto">
          <button
            type="submit"
            class="btn btn-danger"
            @click="deleteMaterial(checkDeleteMaterial.material_id)"
          >
            Yes, Delete Material
          </button>
        </div>
      </div>
    </div>

    <!-- End check delete -->

    <!-- If no Materials -->
    <div class="border rounded p-3" v-if="!lineItemsWithMaterials">
      <h4>Create a Material to get started!</h4>
    </div>
    <!-- END no Materials -->

    <!-- Line Item -->
    <!-- Update line Item without clicking submit, just have it saved automatically -->
    <div
      class="border rounded p-3 mb-2"
      :key="index"
      v-for="(material, index) in lineItemsWithMaterials"
    >
      <form
        enctype="application/x-www-form-urlencoded"
        @submit.prevent="updateLineItem"
      >
        <!-- TOP ROW -->
        <div class="row align-items-center mb-2">
          <!-- NAME/URL/DESCRIPTION for Material -->
          <div class="col">
            <a :href="material.material.url" target="_blank">
              {{ material.material.name }}
            </a>
            - {{ material.material.description }}
          </div>

          <!-- PRICE -->
          <div class="col">
            {{ financialFormat(material.material.price) }}ea x
            {{ material.quantity }} =
            {{ financialFormat(material.quantity * material.material.price) }}
          </div>

          <!-- EDIT MATERIAL -->
          <div class="col">
            <div class="btn-group" role="group" aria-label="Basic example">
              <button
                @click="beginMaterialEdit(material, 'editMaterial')"
                class="btn btn-primary pr-3"
              >
                Edit Material
              </button>
              <button
                class="btn btn-danger"
                @click="showDeleteMaterial(material, 'checkDelete')"
              >
                Delete Material
              </button>
            </div>
          </div>

          <div class="w-100"></div>
          <!-- NOTES -->
          <div class="col">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">Notes</div>
              </div>
              <input
                type="text"
                class="form-control-inline"
                id="notes"
                name="notes"
                placeholder="Notes"
                v-model="material.notes"
              />
            </div>
          </div>

          <!-- QUANTITY -->
          <div class="col">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <div class="input-group-text">Qnty</div>
              </div>
              <input
                type="number"
                class="form-control-inline"
                min="0"
                step="1"
                id="quantity"
                name="quantity"
                placeholder="Quantity"
                v-model="material.quantity"
              />
              <input type="hidden" name="id" :value="material.id" />
            </div>
          </div>

          <!-- UPDATE LINE ITEM -->
          <div class="col">
            <div class="btn-group" role="group" aria-label="Basic example">
              <button type="submit" name="submit" class="btn btn-success">
                Update Item
              </button>
              <button
                @click="duplicateLineItem(material.id, 'checkDelete')"
                class="btn btn-primary"
                type="button"
              >
                Duplicate Item&nbsp;&nbsp;
              </button>
              <button
                class="btn btn-danger"
                type="button"
                @click="deleteLineItem(material.id)"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- END Line Item -->
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const projectId = route.params.id
const apiClient = inject('$api', {})
const project = ref({})
const showEditMaterialForm = ref(false)
const showCheckDeleteForm = ref(false)
const updatedMaterial = ref({})
const checkDeleteMaterial = ref({})
const lineItemsWithMaterials = ref([])

// this takes the data from the material and puts it in the edit material form
const beginMaterialEdit = (data, area) => {
  updatedMaterial.value = data
  showEditMaterialForm.value = true
  scroll(area)
}
// grab the project data
const getProject = async () => {
  project.value = await apiClient.getProject(projectId)
}
// get all materials and line items associated with project ID
const getLineItemsWithMaterials = async () => {
  lineItemsWithMaterials.value = await apiClient.getLineItemsWithMaterials(
    projectId
  )
}
// Create new material along with blank line item and then run getLineItemsWithMaterials again
const createMaterial = async (e) => {
  const data = new FormData(e.target)
  await apiClient.createMaterial(data)
  getLineItemsWithMaterials()
}
// Update the material
const updateMaterial = async (e) => {
  const data = new FormData(e.target)
  await apiClient.updateMaterial(updatedMaterial.value.material_id, data)
  getLineItemsWithMaterials()
  showEditMaterialForm.value = false
}
// Check to delete Material
const showDeleteMaterial = (data, area) => {
  checkDeleteMaterial.value = data
  showCheckDeleteForm.value = true
  scroll(area)
}
// Delete the material
const deleteMaterial = async (id) => {
  await apiClient.deleteMaterial(id)
  getLineItemsWithMaterials()
  showCheckDeleteForm.value = false
}
// Update line item and reload materials
const updateLineItem = async (e) => {
  const data = new FormData(e.target)
  await apiClient.updateLineItem(data)
  getLineItemsWithMaterials()
}
// Duplicate Line Item
const duplicateLineItem = async (id, area) => {
  await apiClient.duplicateLineItem(id)
  getLineItemsWithMaterials()
  scroll(area)
}
// Delete Line Item
const deleteLineItem = async (id) => {
  await apiClient.deleteLineItem(id)
  getLineItemsWithMaterials()
}
// Calculate the total cost of all line items in project
const totalProjectCost = () => {
  let totalCost = 0
  for (const lineItem of lineItemsWithMaterials.value) {
    totalCost += lineItem.quantity * lineItem.material.price
  }
  return financialFormat(totalCost)
}
// format the money in a good way
const financialFormat = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(number)
}

const scroll = (area) => {
  console.log(area)
  const element = document.getElementById(area)
  element.scrollIntoView({ behavior: 'smooth' })
}

onMounted(getProject)
onMounted(getLineItemsWithMaterials)
</script>
