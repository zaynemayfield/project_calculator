<template>
  <div>
    <!-- Project Details -->
    <div class="row mb-3">
      <div class="col">
        <strong>{{ project.name }}</strong> - {{ project.summary }}
        <i>({{ project.type }})</i>
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
    <div class="card" v-if="showEditMaterialForm">
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
                value=""
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
                value=""
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
                value=""
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
                value=""
              />
            </div>
            <div class="col">
              <input type="hidden" name="id" value="" />
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
    <div class="border rounded p-2">
      <div class="row">
        <div class="col">
          <h5>Project Info:</h5>
        </div>
        <div class="col">Total Project Cost: {{ totalProjectCost() }}</div>
        <div class="col">Number of Items: {{ lineItems.length }}</div>
      </div>
    </div>

    <!-- End Project Information -->

    <!-- If no Materials -->
    <div class="border rounded p-3" v-if="!materials">
      <h4>Create a Material to get started!</h4>
    </div>
    <!-- END no Materials -->

    <!-- Line Item -->
    <!-- Update line Item without clicking submit, just have it saved automatically -->
    <div
      class="border rounded p-3"
      :key="index"
      v-for="(lineItem, index) in lineItems"
    >
      <!-- TOP ROW -->
      <div class="row align-items-center mb-2">
        <!-- NAME -->
        <div class="col">
          {{ getMaterial(lineItem.material).name }}
        </div>

        <!-- URL -->
        <div class="col">
          <a :href="getMaterial(lineItem.material).url" target="_blank">
            {{ getMaterial(lineItem.material).url }}
          </a>
        </div>

        <!-- DESCRIPTION -->
        <div class="col">
          {{ getMaterial(lineItem.material).description }}
        </div>

        <!-- EDIT MATERIAL -->
        <div class="col text-end">
          <button
            @click="beginMaterialEdit"
            type="submit"
            class="btn btn-primary"
          >
            Edit Material
          </button>
        </div>

        <!-- DELETE MATERIAL -->
        <div class="col">
          <button
            type="submit"
            class="btn btn-danger"
            @click="deleteMaterial(lineItem.material)"
          >
            Delete Material
          </button>
        </div>
      </div>
      <!-- BOTTOM ROW -->
      <div class="row align-items-center">
        <!-- NOTES -->
        <div class="col">
          <input
            type="text"
            class="form-control"
            id="notes"
            name="notes"
            placeholder="Notes"
            v-model="lineItem.notes"
          />
        </div>

        <!-- PRICE -->
        <div class="col">
          {{ financialFormat(getMaterial(lineItem.material).price) }}
        </div>

        <!-- QUANTITY -->
        <div class="col">
          <input
            type="number"
            class="form-control"
            min="0"
            step="1"
            id="quantity"
            name="quantity"
            placeholder="Quantity"
            v-model="lineItem.quantity"
          />
        </div>

        <!-- TOTAL -->
        <div class="col">
          {{
            financialFormat(
              lineItem.quantity * getMaterial(lineItem.material).price
            )
          }}
        </div>

        <!-- DUPLICATE LINE ITEM -->
        <div class="col">
          <button
            @click="duplicateLineItem(index)"
            type="submit"
            class="btn btn-success"
          >
            Duplicate Item
          </button>
        </div>
      </div>
    </div>
    <!-- END Line Item -->
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    const projectId = route.params.id;
    const apiClient = inject("$api", {});
    const materialLine = ref([]);
    const project = ref({});
    const materials = ref([]);
    const showEditMaterialForm = ref(false);
    const lineItems = ref([]);

    const beginMaterialEdit = () => {
      showEditMaterialForm.value = true;
    };

    const getProject = async () => {
      project.value = await apiClient.getProject(projectId);
    };

    const getMaterials = async () => {
      materials.value = await apiClient.getMaterials(projectId);
    };

    const getLineItems = async () => {
      lineItems.value = await apiClient.getLineItems(projectId);
      //console.log(lineItems)
    };

    const getMaterialLine = async () => {
      materialLine.value = await apiClient.getMaterialLine(projectId);
      console.log("MaterialLine: " + materialLine.value);
    };

    const getMaterial = (index) => {
      return materials.value[index];
    };

    const updateMaterial = () => {
      // API Call here to update material
      //if call successful, then:
      showEditMaterialForm.value = false;
    };

    const deleteMaterial = (materialIndex) => {
      lineItems.value.splice(materialIndex, 1);
    };

    const duplicateLineItem = (index) => {
      const itemToDuplicate = { ...lineItems.value[index] };
      lineItems.value.push(itemToDuplicate);
    };

    const financialFormat = (number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(number);
    };

    const totalProjectCost = () => {
      let totalCost = 0;
      for (const lineItem of lineItems.value) {
        totalCost += lineItem.quantity * getMaterial(lineItem.material).price;
      }
      return financialFormat(totalCost);
    };

    onMounted(getProject);
    onMounted(getMaterials);
    onMounted(getLineItems);
    onMounted(getMaterialLine);
    return {
      project,
      showEditMaterialForm,
      updateMaterial,
      beginMaterialEdit,
      materials,
      deleteMaterial,
      lineItems,
      getMaterial,
      duplicateLineItem,
      financialFormat,
      totalProjectCost,
      createMaterial: (e) => {
        const data = new FormData(e.target);
        apiClient.createMaterial(data);
      },
    };
  },
};
</script>