<template>
  <v-container class="fill-height d-flex align-center justify-center bg-grey-lighten-3 pa-0" fluid>
    <v-card class="mx-auto pa-8" width="400">
      <h2 class="text-h5 text-primary text-center">{{ tab === 0 ? 'Login' : 'Register' }}</h2>
      <v-tabs v-model="tab" grow class="mb-4 mt-2">
        <v-tab :value="0">Login</v-tab>
        <v-tab :value="1">Register</v-tab>
      </v-tabs>
      <v-alert v-if="authError" type="error" class="mb-2" dense>{{ authError }}</v-alert>
      <v-form @submit.prevent="onSubmit">
        <v-text-field
          v-model="email"
          class="mb-2"
          label="Email"
          type="email"
          required
          autocomplete="email"
        />
        <v-text-field
          v-model="password"
          class="mb-2"
          label="Password"
          type="password"
          required
          autocomplete="current-password"
        />
        <v-btn color="primary" type="submit" block class="mt-2" :loading="submitting">
          {{ tab === 0 ? 'Login' : 'Register' }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const tab = ref(0);
    const submitting = ref(false);
    const store = useStore();
    const router = useRouter();

    const authError = computed(() => store.state.authError);

    watch(
      () => store.state.token,
      (token) => {
        if (token) router.push('/dashboard');
      }
    );

    async function onSubmit() {
      submitting.value = true;
      const payload = { email: email.value, password: password.value };
      if (tab.value === 0) {
        await store.dispatch('login', payload);
      } else {
        await store.dispatch('register', payload);
      }
      submitting.value = false;
    }

    return { email, password, tab, submitting, authError, onSubmit };
  }
});
</script>
