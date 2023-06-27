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
      path: "/courierboy",
      name: "courierboy",
      component: () => import("./views/CourierBoyDashboard.vue"),
    },    
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Profile.vue"),
    },
  ],
});

export default router;
