<template>
  <v-app-bar app flat color="white" class="elevation-1">
    <v-toolbar-title class="text-primary font-weight-bold">MCT Calculator</v-toolbar-title>
    <div class="flex-grow-1"></div>
    <div v-if="user" class="d-flex align-center text-accent mr-3">{{ user.email }}</div>
    <v-btn color="secondary" variant="outlined" @click="logout">Logout</v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);

    function logout() {
      store.dispatch('logout');
      router.push('/login');
    }

    return { user, logout };
  }
});
</script>
