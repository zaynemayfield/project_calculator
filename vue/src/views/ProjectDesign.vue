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
          Number of Items: {{ project.line_item.length }}
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
    <div class="border rounded p-3" v-if="!project.line_item.length">
      <h4>Create a Material to get started!</h4>
    </div>
    <!-- END no Materials -->

    <!-- Line Item -->
    <!-- Update line Item without clicking submit, just have it saved automatically -->
    <div
      class="border rounded p-3 mb-2"
      :key="index"
      v-for="(material, index) in project.line_item"
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
import financialFormat from '../utilities/financialFormat'
const route = useRoute()
const projectId = route.params.id
const apiClient = inject('$api', {})
const project = ref({ line_item: [] })
const showEditMaterialForm = ref(false)
const showCheckDeleteForm = ref(false)
const updatedMaterial = ref({})
const checkDeleteMaterial = ref({})

// this takes the data from the material and puts it in the edit material form
const beginMaterialEdit = (data, area) => {
  updatedMaterial.value = data
  showEditMaterialForm.value = true
  scroll(area)
}
// grab the project data
const getProject = async () => {
  const projectResponse = await apiClient.getProject(projectId)
  project.value = projectResponse?.project
}

// Create new material along with blank line item and then run getLineItemsWithMaterials again
const createMaterial = async (e) => {
  const data = new FormData(e.target)
  const lineItemResponse = await apiClient.createMaterial(data)
  if (lineItemResponse?.line_item) {
    project.value.line_item.push(lineItemResponse.line_item)
  }
}
// Update the material
const updateMaterial = async (e) => {
  const data = new FormData(e.target)
  const updateMaterialResponse = await apiClient.updateMaterial(updatedMaterial.value.material_id, data)
  if (updateMaterialResponse?.material) {
    const material = updateMaterialResponse.material
    showEditMaterialForm.value = false
    const updatedProject = project.value
    // Loop thorugh find matching id and replace with updated information
    for (const lineItem of updatedProject.line_item) {
      if (lineItem.material_id === material.id) {
        lineItem.material = material
      }
    }
    // set project to the new updated information
    project.value = updatedProject
  }
}
// Check to delete Material
const showDeleteMaterial = (data, area) => {
  checkDeleteMaterial.value = data
  showCheckDeleteForm.value = true
  scroll(area)
}
// Delete the material
const deleteMaterial = async (id) => {
  const deleteMaterialResponse = await apiClient.deleteMaterial(id)
  if (deleteMaterialResponse?.material) {
    showCheckDeleteForm.value = false
    const material = deleteMaterialResponse.material
    const updatedProject = project.value
    updatedProject.line_item = updatedProject.line_item.filter(lineItem => lineItem.material_id !== material.id)
    project.value = updatedProject
  }
}
// Duplicate Line Item
const duplicateLineItem = async (id, area) => {
  const newLineItemRequest = await apiClient.duplicateLineItem(id)
  if (newLineItemRequest?.line_item) {
    const lineItem = newLineItemRequest.line_item
    const existingLineItem = project.value.line_item.find(item => item.material_id === lineItem.material_id)
    lineItem.material = existingLineItem
    project.value.line_item.push(lineItem)
    scroll(area)
  }
}
// Update line item and reload materials
const updateLineItem = async (e) => {
  const data = new FormData(e.target)
  const updatedLineItemRequest = await apiClient.updateLineItem(data)
  if (updatedLineItemRequest?.line_item) {
    const updatedLineItem = updatedLineItemRequest.line_item
    const projectCopy = project.value
    const lineItem = projectCopy.line_item.find(item => item.id === updatedLineItem.id)
    updatedLineItem.material = lineItem.material
    project.value = projectCopy
  }
}
// Delete Line Item
const deleteLineItem = async (id) => {
  const deleteLineItemRequest = await apiClient.deleteLineItem(id)
  if (deleteLineItemRequest?.line_item) {
    const lineItem = deleteLineItemRequest.line_item
    const lineItemIndex = project.value.line_item.findIndex(item => item.id === lineItem.id)
    project.value.line_item.splice(lineItemIndex, 1)
  }
  // getLineItemsWithMaterials()
}
// Calculate the total cost of all line items in project
const totalProjectCost = () => {
  // let totalCost = 0
  // for (const lineItem of project.value.line_item) {
  //   totalCost += lineItem.quantity * lineItem.material.price
  // }
  const totalCost = project.value.line_item.reduce((total, lineItem) => {
    return total + lineItem.quantity * lineItem.material.price
  }, 0)
  return financialFormat(totalCost)
}

const scroll = (area) => {
  console.log(area)
  const element = document.getElementById(area)
  element.scrollIntoView({ behavior: 'smooth' })
}

onMounted(getProject)
</script>
