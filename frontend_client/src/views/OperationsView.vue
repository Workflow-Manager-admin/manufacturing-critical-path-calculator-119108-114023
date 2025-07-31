<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-3 text-primary">Operations</h1>
    <v-row class="mb-4">
      <v-col cols="12" md="6" lg="3">
        <v-select
          v-model="filterProduct"
          :items="products"
          item-title="name"
          item-value="id"
          label="Filter by Product"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-btn color="secondary" @click="openEdit(null)">+ Add Operation</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-if="operations.length === 0">
        <div class="card text-accent">No operations found.</div>
      </v-col>
      <v-col cols="12" md="6" v-for="(o, idx) in operations" :key="o.id">
        <div class="card d-flex align-center justify-between">
          <div>
            <div class="font-weight-bold">[{{ o.step_number }}] {{ o.name }}</div>
            <div class="text-accent text-body-2">MCT: {{ o.mct_time }} hours</div>
          </div>
          <div>
            <v-btn variant="text" color="primary" @click="openEdit(idx)">Edit</v-btn>
            <v-btn variant="text" color="secondary" @click="deleteOperation(idx)">Delete</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="editDialog" persistent max-width="400">
      <v-card>
        <v-card-title>{{ editIdx === null ? 'Add Operation' : 'Edit Operation' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="opForm.step_number" type="number" label="Step Number" required />
            <v-text-field v-model="opForm.name" label="Operation Name" required />
            <v-text-field v-model="opForm.mct_time" type="number" label="MCT Time (hours)" required />
            <v-select v-model="opForm.product_id" :items="products" item-title="name" item-value="id" label="Product" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="accent" @click="closeEdit">Cancel</v-btn>
          <v-btn color="primary" :disabled="!canSaveOp" @click="saveOperation">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { useStore } from 'vuex';
import {
  fetchProducts,
  fetchOperations,
  createOperation,
  updateOperation,
  deleteOperation as deleteOpApi,
  Product,
  Operation
} from '../utils/api';

export default defineComponent({
  setup() {
    const store = useStore();
    const products = ref<Product[]>([]);
    const operations = ref<Operation[]>([]);
    const opForm = ref<{ name: string; step_number: string; mct_time: string; product_id: string }>({
      name: '',
      step_number: '',
      mct_time: '',
      product_id: ''
    });
    const editDialog = ref(false);
    const editIdx = ref<number | null>(null);
    const filterProduct = ref<string | null>('');
    async function getProducts() {
      if (store.state.token) products.value = await fetchProducts(store.state.token);
    }
    async function getOperations(pid?: string) {
      if (!store.state.token) return;
      operations.value = await fetchOperations(store.state.token, pid ? Number(pid) : undefined);
    }
    function openEdit(idx: number | null) {
      editIdx.value = idx;
      if (idx === null) {
        opForm.value = { name: '', step_number: '', mct_time: '', product_id: '' };
      } else {
        const o = operations.value[idx];
        opForm.value = {
          name: o.name,
          step_number: o.step_number + '',
          mct_time: o.mct_time + '',
          product_id: o.product_id + ''
        };
      }
      editDialog.value = true;
    }
    function closeEdit() {
      opForm.value = { name: '', step_number: '', mct_time: '', product_id: '' };
      editIdx.value = null;
      editDialog.value = false;
    }
    const canSaveOp = computed(
      () => opForm.value.name && opForm.value.step_number && opForm.value.mct_time && opForm.value.product_id
    );
    async function saveOperation() {
      if (!store.state.token) return;
      const op = {
        ...opForm.value,
        product_id: Number(opForm.value.product_id),
        step_number: Number(opForm.value.step_number),
        mct_time: Number(opForm.value.mct_time)
      };
      if (editIdx.value === null)
        await createOperation(store.state.token, op);
      else
        await updateOperation(store.state.token, operations.value[editIdx.value].id, op);
      closeEdit();
      await getOperations(filterProduct.value ?? undefined);
    }
    async function deleteOperation(idx: number) {
      if (!store.state.token) return;
      await deleteOpApi(store.state.token, operations.value[idx].id);
      await getOperations(filterProduct.value);
    }
    onMounted(async () => {
      await getProducts();
      await getOperations();
    });
    watch(filterProduct, (val) => {
      getOperations(val ?? undefined);
    });
    return {
      products,
      operations,
      opForm,
      editDialog,
      editIdx,
      filterProduct,
      openEdit,
      closeEdit,
      canSaveOp,
      saveOperation,
      deleteOperation
    };
  }
});
</script>
