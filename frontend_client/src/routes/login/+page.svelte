<script lang="ts">
  import { auth } from '$stores/auth';
  import { login, register } from '$api/rest';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let error: string | null = null;
  let tab = 0;

  function resetFields() {
    email = '';
    password = '';
    error = null;
  }

  async function handleLogin(ev: Event) {
    ev.preventDefault();
    error = null;
    try {
      const { access_token } = await login(email, password);
      auth.login(access_token);
      goto('/dashboard');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  async function handleRegister(ev: Event) {
    ev.preventDefault();
    error = null;
    try {
      await register(email, password);
      const { access_token } = await login(email, password);
      auth.login(access_token);
      goto('/dashboard');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  onMount(() => {
    const unsub = auth.subscribe(({ token }) => {
      if (token) goto('/dashboard');
    });
    return unsub;
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
  <div class="bg-white rounded-lg shadow-lg p-8 min-w-[350px] w-full max-w-md">
    <h2 class="text-2xl font-bold mb-4 text-primary text-center">
      {tab === 0 ? 'Login' : 'Register'}
    </h2>
    <div class="flex border-b border-gray-200 mb-5">
      <button
        class="flex-1 py-2 text-md font-medium focus:outline-none"
        class:text-primary={tab === 0}
        class:font-bold={tab === 0}
        on:click={() => { tab = 0; resetFields(); }}>
        Login
      </button>
      <button
        class="flex-1 py-2 text-md font-medium focus:outline-none"
        class:text-primary={tab === 1}
        class:font-bold={tab === 1}
        on:click={() => { tab = 1; resetFields(); }}>
        Register
      </button>
    </div>
    <form use:preventDefault on:submit={tab === 0 ? handleLogin : handleRegister}>
      <input
        type="email"
        class="w-full border rounded px-3 py-2 mb-2"
        placeholder="Email"
        bind:value={email}
        required
        autocomplete="email"
      />
      <input
        type="password"
        class="w-full border rounded px-3 py-2 mb-2"
        placeholder="Password"
        bind:value={password}
        required
        autocomplete="current-password"
      />
      {#if error}
        <div class="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>
      {/if}
      <button
        type="submit"
        class="w-full bg-primary text-white py-2 rounded-md font-semibold mt-2 mb-1 transition hover:bg-gray-900">
        {tab === 0 ? 'Log in' : 'Register'}
      </button>
    </form>
  </div>
</div>
