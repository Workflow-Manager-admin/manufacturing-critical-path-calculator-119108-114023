<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-3 text-primary">Dashboard</h1>
    <v-row dense>
      <v-col v-for="(p, idx) in products" :key="p.id" cols="12" sm="6" md="4" lg="3">
        <div class="card border-start border-secondary ps-4 pe-2">
          <div class="font-weight-bold mb-1">{{ p.name }}</div>
          <div class="text-accent text-body-2">{{ p.description }}</div>
          <div class="mt-2 font-weight-medium">
            MCT:
            <span class="text-secondary font-weight-bold">
              <span v-if="loading">Calculating...</span>
              <span v-else>{{ mctResults[idx]?.total_mct ?? '--' }}</span> hours
            </span>
          </div>
          <v-btn
            class="mt-3"
            variant="text"
            color="secondary"
            @click="viewReport(p.id)"
            size="small"
            >View Report</v-btn
          >
        </div>
      </v-col>
      <v-col v-if="!products.length" cols="12">
        <div class="card px-4 py-5 text-center">
          <div class="text-accent">No products yet.</div>
          <div>Create a product to get started!</div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { fetchProducts, calculateMCT, Product } from '../utils/api';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);
    const products = ref<Product[]>([]);
    const mctResults = ref<{ total_mct: number }[]>([]);

    const token = computed(() => store.state.token);

    async function load() {
      if (!token.value) return;
      products.value = await fetchProducts(token.value);
      if (products.value.length) {
        loading.value = true;
        mctResults.value = await Promise.all(
          products.value.map((prod) => calculateMCT(token.value, prod.id))
        );
        loading.value = false;
      }
    }

    function viewReport(productId: number) {
      router.push({ name: 'Reports', query: { product_id: productId } });
    }

    onMounted(load);

    return { products, mctResults, loading, viewReport };
  }
});
</script>
