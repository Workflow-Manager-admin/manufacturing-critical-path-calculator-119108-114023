<script lang="ts">
  import SideNav from '$components/SideNav.svelte';
  import TopBar from '$components/TopBar.svelte';
  import ProtectedRoute from '$components/ProtectedRoute.svelte';
</script>
<ProtectedRoute>
  <div class="flex h-screen w-screen">
    <SideNav />
    <div class="flex-1 flex flex-col min-w-0 bg-gray-50">
      <TopBar />
      <main class="flex-1 p-6 overflow-auto max-h-[calc(100vh-64px)]">
        <slot />
      </main>
    </div>
  </div>
</ProtectedRoute>
