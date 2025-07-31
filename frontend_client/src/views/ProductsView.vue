<template>
  <div>
    <h1 class="text-h4 font-weight-bold text-primary mb-3">Products</h1>
    <v-btn color="secondary" class="mb-3" @click="openDialog(null)">+ Add Product</v-btn>
    <v-row dense>
      <v-col cols="12" v-if="!products.length">
        <div class="text-accent card py-2 px-3">No products found.</div>
      </v-col>
      <v-col cols="12" md="6" v-for="(p, idx) in products" :key="p.id">
        <div class="card d-flex flex-column flex-md-row align-center justify-between py-3 px-4">
          <div>
            <div class="font-weight-bold">{{ p.name }}</div>
            <div class="text-accent text-body-2">{{ p.description }}</div>
          </div>
          <div>
            <v-btn class="mx-2" variant="text" color="primary" @click="openDialog(idx)">Edit</v-btn>
            <v-btn class="mx-2" variant="text" color="secondary" @click="deleteProduct(idx)">Delete</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogOpen" persistent max-width="400">
      <v-card>
        <v-card-title>{{ editIdx === null ? 'Add Product' : 'Edit Product' }}</v-card-title>
        <v-card-text>
          <v-form ref="formRef">
            <v-text-field v-model="form.name" label="Product Name" required />
            <v-textarea v-model="form.description" label="Description" rows="2" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="accent" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :disabled="!form.name" @click="saveProduct">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductApi,
  Product
} from '../utils/api';

export default defineComponent({
  setup() {
    const store = useStore();
    const products = ref<Product[]>([]);
    const dialogOpen = ref(false);
    const editIdx = ref<number | null>(null);
    const form = ref<{ name: string; description: string }>({ name: '', description: '' });

    async function load() {
      if (!store.state.token) return;
      products.value = await fetchProducts(store.state.token);
    }

    function openDialog(idx: number | null) {
      editIdx.value = idx;
      dialogOpen.value = true;
      if (idx === null) form.value = { name: '', description: '' };
      else form.value = { name: products.value[idx].name, description: products.value[idx].description };
    }
    function closeDialog() {
      dialogOpen.value = false;
      editIdx.value = null;
      form.value = { name: '', description: '' };
    }
    async function saveProduct() {
      if (!store.state.token) return;
      if (editIdx.value === null)
        await createProduct(store.state.token, form.value);
      else
        await updateProduct(store.state.token, products.value[editIdx.value].id, form.value);
      closeDialog();
      await load();
    }
    async function deleteProduct(idx: number) {
      if (!store.state.token) return;
      await deleteProductApi(store.state.token, products.value[idx].id);
      await load();
    }

    onMounted(load);

    return { products, dialogOpen, openDialog, closeDialog, editIdx, saveProduct, form, deleteProduct };
  }
});
</script>
