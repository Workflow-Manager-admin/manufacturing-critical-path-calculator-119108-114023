<script lang="ts">
  import { goto } from '$app/navigation';
  import { auth } from '$stores/auth';
  import { page } from '$app/stores';

  function nav(route: string) {
    goto(route);
  }

  function handleLogout() {
    auth.logout();
    goto('/login');
  }
</script>
<nav class="flex flex-col h-full bg-white border-r border-gray-200 w-56 min-h-screen">
  <div class="h-16 flex items-center justify-center text-xl text-primary font-bold border-b border-gray-100">
    MCT Calculator
  </div>
  <ul class="flex-1 pt-4">
    <li><button class="w-full text-left px-6 py-3 hover:bg-gray-100 flex items-center gap-2" on:click={() => nav('/dashboard')}>
      <span class="material-icons">dashboard</span>Dashboard</button>
    </li>
    <li><button class="w-full text-left px-6 py-3 hover:bg-gray-100 flex items-center gap-2" on:click={() => nav('/dashboard/products')}>
      <span class="material-icons">list_alt</span>Products</button>
    </li>
    <li><button class="w-full text-left px-6 py-3 hover:bg-gray-100 flex items-center gap-2" on:click={() => nav('/dashboard/operations')}>
      <span class="material-icons">assignment</span>Operations</button>
    </li>
    <li><button class="w-full text-left px-6 py-3 hover:bg-gray-100 flex items-center gap-2" on:click={() => nav('/dashboard/reports')}>
      <span class="material-icons">assessment</span>Reports</button>
    </li>
  </ul>
  <button class="p-4 w-full text-left bg-gray-50 hover:bg-gray-100 border-t border-gray-200 text-red-600" on:click={handleLogout}>
    <span class="material-icons align-middle mr-2">logout</span>Logout
  </button>
</nav>
<style>
  .material-icons {
    font-family: 'Material Icons', Arial, sans-serif;
    font-size: 1.4em;
    vertical-align: middle;
  }
</style>
