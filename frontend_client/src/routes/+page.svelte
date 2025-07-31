<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$stores/auth';

  onMount(() => {
    const unsubscribe = auth.subscribe(({ token }) => {
      if (!token) goto('/login');
      else goto('/dashboard');
    });
    return unsubscribe;
  });
</script>
```
No content: redirects to login or dashboard.
```
