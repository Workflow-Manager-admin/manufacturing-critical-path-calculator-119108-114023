import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

export default {
  preprocess: [
    preprocess({
      postcss: true
    })
  ],
  kit: {
    adapter: adapter(),
    alias: {
      $components: './src/components',
      $lib: './src/lib',
      $stores: './src/stores',
      $routes: './src/routes',
      $api: './src/api'
    }
  }
};
