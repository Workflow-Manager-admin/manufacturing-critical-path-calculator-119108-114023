<script lang="ts">
  import { auth } from '$stores/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  let isAuthed = false;

  onMount(() => {
    const unsub = auth.subscribe(({ token }) => {
      isAuthed = !!token;
      if (!isAuthed) goto('/login');
    });
    return unsub;
  });
</script>
{#if isAuthed}
  <slot />
{/if}
