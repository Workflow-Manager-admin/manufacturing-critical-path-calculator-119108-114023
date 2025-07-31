<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-3 text-primary">MCT Report</h1>
    <v-row class="mb-2">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedProduct"
          :items="products"
          item-title="name"
          item-value="id"
          label="Select Product"
          @change="getReportData"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn border variant="outlined" color="primary" @click="handlePrint">Print</v-btn>
        <v-btn border variant="outlined" color="secondary" @click="exportToCSV">Export CSV</v-btn>
      </v-col>
    </v-row>
    <v-card>
      <div v-if="mctResult" class="mb-2 px-4 pt-3 font-weight-medium">
        Total MCT: <span class="text-secondary">{{ mctResult.total_mct }}</span> hours
        <span class="text-accent ms-4">
          ({{ products.find((p) => p.id === selectedProduct)?.name || '' }})
        </span>
      </div>
      <v-simple-table id="mct-table" class="mb-0">
        <thead>
          <tr>
            <th>Step</th>
            <th>Operation</th>
            <th>MCT Time (hours)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="op in operations" :key="op.id">
            <td>{{ op.step_number }}</td>
            <td>{{ op.name }}</td>
            <td>{{ op.mct_time }}</td>
          </tr>
          <tr v-if="operations.length === 0">
            <td colspan="3" class="text-accent">No operations for selected product.</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import {
  fetchProducts,
  fetchOperations,
  calculateMCT,
  Product,
  Operation
} from '../utils/api';

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const products = ref<Product[]>([]);
    const operations = ref<Operation[]>([]);
    const mctResult = ref<{ total_mct: number } | null>(null);
    const selectedProduct = ref<number | null>(null);

    async function getProducts() {
      if (!store.state.token) return;
      products.value = await fetchProducts(store.state.token);
      if (products.value.length) {
        const initialId: number =
          parseInt((route.query.product_id as string) || '') ||
          products.value[0].id;
        selectedProduct.value = initialId;
      }
    }
    async function getReportData() {
      if (!store.state.token || !selectedProduct.value) return;
      operations.value = await fetchOperations(store.state.token, selectedProduct.value);
      mctResult.value = await calculateMCT(store.state.token, selectedProduct.value);
    }
    function exportToCSV() {
      const rows: string[] = [];
      rows.push('Step,Operation,MCT Time (hours)');
      for (const op of operations.value) {
        rows.push(`"${op.step_number}","${op.name}","${op.mct_time}"`);
      }
      const csv = rows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mct_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    function handlePrint() {
      window.print();
    }
    onMounted(async () => {
      await getProducts();
    });
    watchEffect(() => {
      if (store.state.token && selectedProduct.value) getReportData();
    });
    return {
      products,
      operations,
      mctResult,
      selectedProduct,
      exportToCSV,
      handlePrint,
      getReportData
    };
  }
});
</script>
