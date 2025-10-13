import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  createWebHashHistory,
} from "vue-router";
import store from "@/plugins/store/store";
import i18n from "@/plugins/i18n";

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
        path: "/example-table",
        name: "example-table",
        component: () =>
          import(
            /* webpackMode: "lazy" */ "../views/Examples/TableExample.vue"
          ),
        meta: {
          title: "example-table",
          auth: true,
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
  if (to.matched.some((record) => record.meta.auth)) {
    if (!store.getters["auth/isAuthenticated"]) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  const routerName = to.meta.title || toString.name;
  const translatedRouteName = i18n.global.t(routerName);
  document.title = ` ${translatedRouteName} | Admin Template`;
});

export default router;
