import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("./views/AdminDashboard.vue"),
    },
    {
      path: "/clerk",
      name: "clerk",
      component: () => import("./views/ClerkDashboard.vue"),
    },
    {
      path: "/courier",
      name: "courier",
      component: () => import("./views/CourierDashboard.vue"),
    },    
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Profile.vue"),
    },
  ],
});

export default router;
