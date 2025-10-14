import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  createWebHashHistory,
} from "vue-router";
import store from "@/plugins/store/store";
import i18n from "@/plugins/i18n";
import Roles from "@/constants/Roles";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/password-recover",
    name: "password-recover",
    component: () =>
      import(/* webpackMode: "lazy" */ "../views/Auth/PasswordRecover.vue"),
    meta: {
      title: "recover",
    },
  },
  {
    path: "/login",
    name: "UserLogin",
    component: () =>
      import(/* webpackMode: "lazy" */ "../views/Auth/UserLogin.vue"),
    meta: {
      title: "login",
    },
  },
  {
    path: "/",
    component: () => import(/* webpackMode: "lazy" */ "../views/Base.vue"),
    meta: {
      title: "Welcome",
      auth: true,
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import(/* webpackMode: "lazy" */ "../views/Home.vue"),
        meta: {
          title: "welcome",
          auth: true,
        },
      },
      {
        path: "/users",
        name: "users",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Auth/Users/Index.vue"),
        meta: {
          title: "users",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/users/create",
        name: "users-create",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Auth/Users/Form.vue"),
        meta: {
          title: "users-create",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/users/:id",
        name: "users-details",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Auth/Users/Details.vue"),
        meta: {
          title: "users-details",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/users/:id/edit",
        name: "users-edit",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Auth/Users/Form.vue"),
        meta: {
          title: "users-edit",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!store.getters["auth/isAuthenticated"];
  const currentUser = store.getters["auth/currentUser"];

  // Rutas que requieren autenticación
  if (to.matched.some((record) => record.meta.auth)) {
    if (!isAuthenticated) {
      return next({ path: "/login", query: { redirect: to.fullPath } });
    }

    const requiredRoles: number[] = to.matched
      .flatMap((r) =>
        r.meta && (r.meta as any).roles ? (r.meta as any).roles : []
      )
      .map((v: any) => Number(v))
      .filter((v: number) => !Number.isNaN(v));

    if (requiredRoles.length > 0) {
      const userLevel = Number(currentUser?.authLevel ?? null);
      if (!currentUser || !requiredRoles.includes(userLevel)) {
        return next({ name: "dashboard" });
      }
    }

    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      const userLevel = Number(currentUser?.authLevel ?? null);
      if (!currentUser || userLevel !== Roles.Admin) {
        return next({ name: "dashboard" });
      }
    }

    return next();
  }

  if (to.name === "UserLogin" && isAuthenticated) {
    return next({ name: "dashboard" });
  }

  if (!isAuthenticated && to.path === "/") {
    return next({ path: "/login" });
  }

  return next();
});

router.afterEach((to) => {
  const routerName = to.meta.title || toString.name;
  const translatedRouteName = i18n.global.t(routerName);
  document.title = ` ${translatedRouteName} | Admin Template`;
});

export default router;
