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
          import(/* webpackMode: "lazy" */ "../views/Users/Index.vue"),
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
          import(/* webpackMode: "lazy" */ "../views/Users/Form.vue"),
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
          import(/* webpackMode: "lazy" */ "../views/Users/Details.vue"),
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
          import(/* webpackMode: "lazy" */ "../views/Users/Form.vue"),
        meta: {
          title: "users-edit",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      // Locations routes
      {
        path: "/locations",
        name: "locations",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Locations/Index.vue"),
        meta: {
          title: "locations",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/locations/create",
        name: "locations-create",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Locations/Form.vue"),
        meta: {
          title: "locations-create",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/locations/:id",
        name: "locations-details",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Locations/Details.vue"),
        meta: {
          title: "locations-details",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/locations/:id/edit",
        name: "locations-edit",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Locations/Form.vue"),
        meta: {
          title: "locations-edit",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      // Agencies routes
      {
        path: "/agencies",
        name: "agencies",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Agencies/Index.vue"),
        meta: {
          title: "agencies",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/agencies/create",
        name: "agencies-create",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Agencies/Form.vue"),
        meta: {
          title: "agencies-create",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/agencies/:id",
        name: "agencies-details",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Agencies/Details.vue"),
        meta: {
          title: "agencies-details",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/agencies/:id/edit",
        name: "agencies-edit",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Agencies/Form.vue"),
        meta: {
          title: "agencies-edit",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      // Brands routes
      {
        path: "/brands",
        name: "brands",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Brands/Index.vue"),
        meta: {
          title: "brands",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/brands/create",
        name: "brands-create",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Brands/Form.vue"),
        meta: {
          title: "brands-create",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/brands/:id",
        name: "brands-details",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Brands/Details.vue"),
        meta: {
          title: "brands-details",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/brands/:id/edit",
        name: "brands-edit",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Brands/Form.vue"),
        meta: {
          title: "brands-edit",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      // Types routes
      {
        path: "/types",
        name: "types",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Types/Index.vue"),
        meta: {
          title: "types",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/types/create",
        name: "types-create",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Types/Form.vue"),
        meta: {
          title: "types-create",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/types/:id",
        name: "types-details",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Types/Details.vue"),
        meta: {
          title: "types-details",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/types/:id/edit",
        name: "types-edit",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Types/Form.vue"),
        meta: {
          title: "types-edit",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      // Models routes
      {
        path: "/models",
        name: "models",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Models/Index.vue"),
        meta: {
          title: "models",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/models/create",
        name: "models-create",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Models/Form.vue"),
        meta: {
          title: "models-create",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/models/:id",
        name: "models-details",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Models/Details.vue"),
        meta: {
          title: "models-details",
          auth: true,
          requiresAdmin: true,
          roles: [Roles.Admin],
        },
      },
      {
        path: "/models/:id/edit",
        name: "models-edit",
        component: () =>
          import(/* webpackMode: "lazy" */ "../views/Models/Form.vue"),
        meta: {
          title: "models-edit",
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
