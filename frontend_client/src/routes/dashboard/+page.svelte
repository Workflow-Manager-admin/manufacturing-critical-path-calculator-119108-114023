<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$stores/auth';
  import { fetchProducts, calculateMCT, Product } from '$api/rest';

  let products: Product[] = [];
  let mctResults: { total_mct: number }[] = [];
  let loading = false;

  $: token = $auth.token;

  onMount(async () => {
    if (!token) return;
    products = await fetchProducts(token);
    if (products.length) {
      loading = true;
      mctResults = await Promise.all(
        products.map(prod => calculateMCT(token, prod.id))
      );
      loading = false;
    }
  });
</script>

<h1 class="text-3xl font-bold mb-4 text-primary">Dashboard</h1>
<div class="flex flex-wrap gap-5">
  {#each products as p, idx}
    <div class="card border-l-4 border-secondary flex flex-col flex-grow min-w-[250px] p-5">
      <div class="font-semibold text-lg">{p.name}</div>
      <div class="text-accent text-sm">{p.description}</div>
      <div class="mt-2 font-semibold">
        MCT:
        <span class="text-secondary font-bold">
          {loading ? 'Calculating...' : mctResults[idx]?.total_mct ?? '--'}
        </span>
        hours
      </div>
      <button
        class="text-secondary underline mt-3 font-medium text-sm"
        type="button"
        on:click={() => window.location.assign(`/dashboard/reports?product_id=${p.id}`)}
      >
        View Report
      </button>
    </div>
  {/each}
  {#if products.length === 0}
    <div class="card p-5 text-center w-full">
      <div class="text-accent">No products yet.</div>
      <div>Create a product to get started!</div>
    </div>
  {/if}
</div>
