<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$stores/auth';
  import {
    fetchProducts, fetchOperations, createOperation, updateOperation, deleteOperation,
    Product, Operation
  } from '$api/rest';

  let products: Product[] = [];
  let operations: Operation[] = [];
  let form = { name: '', step_number: '', mct_time: '', product_id: '' };
  let open = false;
  let editIdx: number | null = null;
  let filterProduct = '';

  $: token = $auth.token;

  async function getProducts() {
    if/token) products = await fetchProducts(token);
  }
  async function getOperations(pid?: string) {
    if (!token) return;
    operations = await fetchOperations(token, pid ? Number(pid) : undefined);
  }

  function openEdit(idx: number) {
    editIdx = idx;
    form = {
      name: operations[idx].name,
      step_number: operations[idx].step_number + '',
      mct_time: operations[idx].mct_time + '',
      product_id: operations[idx].product_id + ''
    };
    open = true;
  }

  async function handleSave() {
    if (!token) return;
    const op = {
      ...form,
      product_id: Number(form.product_id),
      step_number: Number(form.step_number),
      mct_time: Number(form.mct_time)
    };
    if (editIdx === null) await createOperation(token, op);
    else await updateOperation(token, operations[editIdx].id, op);
    open = false;
    editIdx = null;
    form = { name: '', step_number: '', mct_time: '', product_id: '' };
    await getOperations(filterProduct);
  }

  async function handleDelete(idx: number) {
    if (!token) return;
    await deleteOperation(token, operations[idx].id);
    await getOperations(filterProduct);
  }

  onMount(async () => {
    await getProducts();
    await getOperations();
  });
  $: if (filterProduct !== undefined) getOperations(filterProduct);

</script>

<h1 class="text-2xl font-bold mb-3 text-primary">Operations</h1>
<div class="flex gap-4 mb-4 items-center">
  <select class="px-4 py-2 border border-gray-200 rounded bg-white min-w-[180px]" bind:value={filterProduct}>
    <option value="">Show All</option>
    {#each products as p}
      <option value={p.id}>{p.name}</option>
    {/each}
  </select>
  <button class="bg-secondary text-white px-4 py-2 rounded font-semibold"
    on:click={() => { open = true; editIdx = null; form = { name: '', step_number: '', mct_time: '', product_id: '' }; }}>
    + Add Operation
  </button>
</div>
<div class="flex flex-col gap-4">
  {#if operations.length === 0}
    <div class="p-3 text-accent">No operations found.</div>
  {/if}
  {#each operations as o, idx}
    <div class="card flex flex-row justify-between items-center p-4">
      <div>
        <div class="font-semibold">[{o.step_number}] {o.name}</div>
        <div class="text-sm text-accent">MCT Time: {o.mct_time} hours</div>
      </div>
      <div>
        <button class="mx-1 text-primary font-bold text-sm" on:click={() => openEdit(idx)}>Edit</button>
        <button class="mx-1 text-secondary font-bold text-sm" on:click={() => handleDelete(idx)}>Delete</button>
      </div>
    </div>
  {/each}
</div>

{#if open}
  <div class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
    <div class="card p-8 min-w-[340px]">
      <div class="text-lg font-bold mb-4">{editIdx === null ? 'Add Operation' : 'Edit Operation'}</div>
      <input class="w-full border rounded px-3 py-2 mb-2" placeholder="Step Number" bind:value={form.step_number} />
      <input class="w-full border rounded px-3 py-2 mb-2" placeholder="Operation Name" bind:value={form.name} />
      <input class="w-full border rounded px-3 py-2 mb-2" placeholder="MCT Time (hours)" bind:value={form.mct_time} />
      <select class="w-full border rounded px-3 py-2 mb-2" bind:value={form.product_id}>
        <option value="">Select Product</option>
        {#each products as p}
          <option value={p.id}>{p.name}</option>
        {/each}
      </select>
      <div class="flex justify-between mt-4">
        <button class="text-accent" on:click={() => (open = false)}>Cancel</button>
        <button class="rounded bg-primary text-white px-5 py-1 font-bold disabled:bg-gray-200"
          on:click={handleSave}
          disabled={!form.name || !form.step_number || !form.mct_time || !form.product_id}>
          Save
        </button>
      </div>
    </div>
  </div>
{/if}
