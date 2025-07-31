import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import ProductsView from '../views/ProductsView.vue';
import OperationsView from '../views/OperationsView.vue';
import ReportsView from '../views/ReportsView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'Login', component: LoginView, meta: { public: true } },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/products',
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/operations',
    name: 'Operations',
    component: OperationsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { requiresAuth: true }
  },
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isLoggedIn) next({ name: 'Login' });
  else if (to.meta.public && isLoggedIn) next({ name: 'Dashboard' });
  else next();
});

export default router;
