<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$stores/auth';
  import {
    fetchProducts,
    fetchOperations,
    calculateMCT,
    Product,
    Operation
  } from '$api/rest';

  let products: Product[] = [];
  let selectedProduct = '';
  let operations: Operation[] = [];
  let mctResult: { total_mct: number } | null = null;

  $: token = $auth.token;

  async function getProducts() {
    if (!token) return;
    products = await fetchProducts(token);
    if (products.length) selectedProduct = products[0].id + '';
  }

  async function getReportData() {
    if (!token || !selectedProduct) return;
    operations = await fetchOperations(token, Number(selectedProduct));
    mctResult = await calculateMCT(token, Number(selectedProduct));
  }

  function exportTableToCSV(tableId: string, filename: string) {
    const table = document.getElementById(tableId);
    if (!table) return;
    let csv = '';
    const rows = table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].querySelectorAll('td,th');
      const row: string[] = [];
      for (let j = 0; j < cols.length; j++) {
        row.push('"' + (cols[j].textContent ?? '').replace(/"/g, '""') + '"');
      }
      csv += row.join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  onMount(async () => {
    await getProducts();
  });
  $: if (token && selectedProduct) getReportData();
</script>

<h1 class="text-2xl font-bold text-primary mb-3">MCT Report</h1>
<div class="card p-3 flex flex-wrap items-center gap-3 mb-2">
  <select class="border rounded p-2 min-w-[180px]" bind:value={selectedProduct}>
    {#each products as p}
      <option value={p.id}>{p.name}</option>
    {/each}
  </select>
  <button
    class="px-4 py-2 border rounded border-primary text-primary font-medium hover:bg-gray-50"
    on:click={handlePrint}>Print</button>
  <button
    class="px-4 py-2 border rounded border-secondary text-secondary font-medium hover:bg-orange-50"
    on:click={() => exportTableToCSV('mct-table', 'mct_report.csv')}>Export CSV</button>
</div>
<div class="card p-4">
  {#if mctResult}
    <div class="mb-2 font-semibold">
      Total MCT: <span class="text-secondary">{mctResult.total_mct}</span> hours
    </div>
    <div class="text-sm text-accent mb-4">
      ({products.find(p => p.id + '' === selectedProduct)?.name || ''})
    </div>
  {/if}
  <table class="w-full text-left" id="mct-table">
    <thead class="border-b">
      <tr>
        <th class="py-2">Step</th>
        <th>Operation</th>
        <th>MCT Time (hours)</th>
      </tr>
    </thead>
    <tbody>
      {#each operations as op}
        <tr>
          <td class="py-1">{op.step_number}</td>
          <td>{op.name}</td>
          <td>{op.mct_time}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if operations.length === 0}
    <div class="text-accent p-2">No operations for selected product.</div>
  {/if}
</div>
