import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { docMenus } from './docs';

let docRoutes = [];
for (const key in docMenus) {
  docRoutes = [...docRoutes, ...docMenus[key]];
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue')
    },
    {
        path: '/demo',
        name: 'demo',
        component: () => import('../views/demo/index.vue')
    },
    {
        path: "/docs",
        redirect: "/docs/start",
        component: () => import('../views/docs.vue'),
        children: docRoutes,
    },
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;