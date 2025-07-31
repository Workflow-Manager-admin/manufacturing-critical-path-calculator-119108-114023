<template>
  <v-app>
    <v-layout>
      <side-nav v-if="showLayout" />
      <v-main :class="showLayout ? 'main-content' : ''">
        <top-bar v-if="showLayout" />
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from './components/TopBar.vue';
import SideNav from './components/SideNav.vue';

export default defineComponent({
  components: { TopBar, SideNav },
  setup() {
    const route = useRoute();
    const showLayout = computed(() => !['/login', '/not-found'].includes(route.path));
    return { showLayout };
  }
});
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  padding-left: 240px;
  background: var(--background);
}
</style>
