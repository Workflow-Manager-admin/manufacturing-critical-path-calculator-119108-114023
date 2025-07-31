<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$stores/auth';
  import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    Product
  } from '$api/rest';

  let products: Product[] = [];
  let dialogOpen = false;
  let editIdx: number | null = null;
  let form: { name: string; description: string } = { name: '', description: '' };

  $: token = $auth.token;

  async function getProducts() {
    if (!token) return;
    products = await fetchProducts(token);
  }

  function openDialog(idx: number | null = null) {
    editIdx = idx;
    dialogOpen = true;
    if (idx === null) form = { name: '', description: '' };
    else {
      form = { name: products[idx].name, description: products[idx].description };
    }
  }

  async function handleSave() {
    if (!token) return;
    if (editIdx === null) await createProduct(token, form);
    else await updateProduct(token, products[editIdx].id, form);
    dialogOpen = false;
    editIdx = null;
    form = { name: '', description: '' };
    await getProducts();
  }

  async function handleDelete(idx: number) {
    if (!token) return;
    await deleteProduct(token, products[idx].id);
    await getProducts();
  }

  onMount(getProducts);
</script>

<h1 class="text-2xl font-bold text-primary mb-3">Products</h1>
<button
  class="bg-secondary text-white px-4 py-2 rounded-md font-semibold mb-4"
  on:click={() => openDialog(null)}>
  + Add Product
</button>
<div class="flex flex-col gap-4">
  {#if products.length === 0}
    <div class="text-accent p-2">No products found.</div>
  {/if}
  {#each products as p, idx}
    <div class="card flex flex-col sm:flex-row items-center justify-between p-4">
      <div>
        <div class="font-semibold">{p.name}</div>
        <div class="text-accent text-sm">{p.description}</div>
      </div>
      <div>
        <button class="text-primary hover:underline mx-2" on:click={() => openDialog(idx)}>Edit</button>
        <button class="text-secondary hover:underline mx-2" on:click={() => handleDelete(idx)}>Delete</button>
      </div>
    </div>
  {/each}
</div>

{#if dialogOpen}
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
    <div class="card p-8 min-w-[350px]">
      <div class="text-lg font-bold mb-4">{editIdx === null ? 'Add Product' : 'Edit Product'}</div>
      <div class="mb-3">
        <input
          class="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          placeholder="Product Name"
          bind:value={form.name}
          required
          />
        <textarea
          class="w-full border border-gray-300 rounded px-3 py-2 resize-none"
          placeholder="Description"
          bind:value={form.description}
          rows={2}
          />
      </div>
      <div class="flex justify-between mt-4">
        <button class="text-accent" on:click={() => { dialogOpen = false; }}>Cancel</button>
        <button
          class="rounded bg-primary text-white px-5 py-1 font-bold disabled:bg-gray-200"
          on:click={handleSave}
          disabled={!form.name}>
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
