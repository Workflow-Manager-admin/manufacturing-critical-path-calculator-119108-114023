<template>
  <v-navigation-drawer app permanent width="240" color="white" class="elevation-2">
    <v-list>
      <v-list-item>
        <v-list-item-title class="text-h5 font-weight-bold py-2 text-primary">
          MCT Calculator
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item link to="/dashboard">
        <v-list-item-icon><span class="material-icons">dashboard</span></v-list-item-icon>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/dashboard/products">
        <v-list-item-icon><span class="material-icons">list_alt</span></v-list-item-icon>
        <v-list-item-title>Products</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/dashboard/operations">
        <v-list-item-icon><span class="material-icons">assignment</span></v-list-item-icon>
        <v-list-item-title>Operations</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/dashboard/reports">
        <v-list-item-icon><span class="material-icons">assessment</span></v-list-item-icon>
        <v-list-item-title>Reports</v-list-item-title>
      </v-list-item>
      <v-divider class="my-2"></v-divider>
      <v-list-item @click="logout">
        <v-list-item-icon><span class="material-icons text-secondary">logout</span></v-list-item-icon>
        <v-list-item-title class="text-secondary">Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    function logout() {
      store.dispatch('logout');
      router.push('/login');
    }
    return { logout };
  }
});
</script>
