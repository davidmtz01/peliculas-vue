import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/peliculas',
      name: 'peliculas',
      component: () => import('../views/Peliculas/Index.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/Peliculas/Edit.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/Peliculas/Create.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/Peliculas/Reports.vue')
    }
  ]
});

router.beforeEach(async (to) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return '/login';
  }
});

export default router;
