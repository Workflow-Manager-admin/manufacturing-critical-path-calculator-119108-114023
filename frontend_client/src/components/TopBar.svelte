<script lang="ts">
  import { auth } from '$stores/auth';
  import { derived } from 'svelte/store';

  const userStore = derived(auth, $auth => $auth.user);
</script>

<header class="h-16 flex items-center px-6 justify-between bg-white border-b border-gray-200 w-full">
  <div class="font-bold text-primary text-lg">MCT Calculator</div>
  <div class="flex items-center gap-3">
    {#if $userStore}
      <span class="text-accent mr-2">{ $userStore.email }</span>
    {/if}
    <button class="border border-secondary px-3 py-1 rounded-2xl text-secondary hover:bg-orange-100" on:click={() => auth.logout()}>
      Logout
    </button>
  </div>
</header>
