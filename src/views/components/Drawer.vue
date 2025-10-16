<template>
  <div>
    <div v-if="!lgAndUp && openDrawer" class="drawer-overlay" @click="closeDrawer"></div>

    <v-navigation-drawer color="#F6F9F6" :width="330" v-model="openDrawer" :permanent="lgAndUp" :temporary="!lgAndUp"
      :location="!lgAndUp ? 'left' : undefined" class="navigation-drawer" :overlay="true" :overlay-opacity="0.4">
      <div class="company">
        <v-img max-width="190px" alt="logo" :src="require('@/assets/image/logo-horizontal.png')" />
      </div>
      <div class="dashboard">
        <v-icon>mdi-view-dashboard</v-icon>
        <v-list>
          <v-list-item exact :to="{ name: 'dashboard' }" link variant="plain">
            <v-list-item-title>{{ $t("dashboard") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      <div v-for="item in items" :key="item.title" class="submenu">
        <v-icon>mdi-{{ item.icon }}</v-icon>
        <div class="divider"></div>
        <v-list>
          <v-list-group v-if="item.children && item.children.length > 0" :value="item.title">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :class="{ 'v-list-item--active': item.active }" variant="plain">
                <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
              </v-list-item>
            </template>
            <v-list-item v-for="child in item.children" :key="child.title"
              :class="{ 'v-list-item--active': child.active }" link variant="plain"
              :to="typeof child.to === 'object' ? child.to : { name: child.to }">
              <v-list-item-title>{{ $t(child.title) }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :class="{ 'v-list-item--active': item.active }" link
            :to="typeof item.to === 'object' ? item.to : { name: item.to }" variant="plain">
              <v-list-item-title>
              {{ $t(item.title) }}
              <v-badge v-if="item.title === 'contact-messages' && isAdmin && unreadCount > 0" 
                       :content="unreadCount" 
                       color="error" 
                       inline 
                       class="ml-2">
              </v-badge>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      <template v-slot:append>
        <v-container class="pa-0 ma-0">
          <v-row class="ml-2 mb-3 align-center">
            <v-col cols="9" class="d-flex align-center">
              <ProfileDialog />
            </v-col>
            <v-col cols="3">
              <confirm-dialog :model-value="dialogVisible" @update:model-value="val => dialogVisible = val" @confirmed="logout">
                <template #activator="{ props }">
                  <v-btn elevation="0" class="px-20 py-10" block v-bind="props" v-on:click="dialogVisible = true">
                    <v-icon color="#E63946">mdi-logout</v-icon>
                  </v-btn>
                </template>
                <template #title>
                  {{ $t("logout") }}
                </template>
                {{ $t("logout-text") }}
              </confirm-dialog>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useDisplay } from 'vuetify';
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import ConfirmDialog from './ConfirmDialog.vue';
import ProfileDialog from './ProfileDialog.vue';
import Roles from '@/constants/Roles';

interface RouteInfo {
  name: string;
  path: string;
}

interface MenuItem {
  title: string;
  icon: string;
  to?: RouteInfo | string;
  children?: MenuItem[];
  active?: boolean;
}

export default defineComponent({
  components: {
    ConfirmDialog,
    ProfileDialog,
  },
  setup() {
    const store = useStore();
    const { lgAndUp } = useDisplay();
    const hoverIndex = ref(-1);

    const openDrawer = computed({
      get: () => store.state.openDrawer,
      set: (value) => store.commit('setDrawerOpen', value)
    });

    const dialogVisible = ref(false);
    const route = useRoute();
    const router = useRouter();

    const currentUser = computed(() => store.getters['auth/currentUser']);
    const isAdmin = computed(() => currentUser.value?.authLevel === Roles.Admin);
    const unreadCount = computed(() => store.state.contacts?.unreadCount || 0);

    const items = computed(() => {
      const menuItems: MenuItem[] = [
      ];

      menuItems.push({
        title: 'motorcycles',
        icon: 'motorbike',
        to: 'motorcycles',
        children: []
      });

  if (isAdmin.value) {
        menuItems.push({
          title: 'insights',
          icon: 'chart-bar',
          to: 'insights',
          children: []
        });

        menuItems.push({
          title: 'users',
          icon: 'account-group',
          to: 'users',
          children: []
        });

        menuItems.push({
          title: 'locations',
          icon: 'map-marker',
          to: 'locations',
          children: []
        });

        menuItems.push({
          title: 'agencies',
          icon: 'office-building',
          to: 'agencies',
          children: []
        });

        menuItems.push({
          title: 'brands',
          icon: 'tag',
          to: 'brands',
          children: []
        });

        menuItems.push({
          title: 'models',
          icon: 'shape',
          to: 'models',
          children: []
        });

        menuItems.push({
          title: 'types',
          icon: 'sitemap',
          to: 'types',
          children: []
        });

        menuItems.push({
          title: 'contact-messages',
          icon: 'email-multiple',
          to: 'contact-messages',
          children: []
        });

        menuItems.push({
          title: 'contact-info',
          icon: 'information',
          to: 'contact-info',
          children: []
        });
      }

      return menuItems;
    });

    const isActive = (route: RouteLocationNormalizedLoaded, item: MenuItem): boolean => {
      if (item.to && typeof item.to === 'object' && 'path' in item.to) {
        return route.path.startsWith(item.to.path);
      }
      if (item.children && item.children.length > 0) {
        return item.children.some((child) => isActive(route, child));
      }
      return false;
    };

    const setActiveItem = () => {
      items.value.forEach((item) => {
        item.active = isActive(route, item);
        if (item.children) {
          item.children.forEach((child) => {
            child.active = isActive(route, child);
          });
        }
      });
    };

    watch(
      () => route.fullPath,
      async () => {
        setActiveItem();
        if (!lgAndUp.value) {
          store.commit('setDrawerOpen', false);
        }
        try {
          if (isAdmin.value) {
            await store.dispatch('contacts/loadUnreadCount');
          }
        } catch (error) {
          await store.dispatch('notificator/errorResponse', error);
        }
      }
    );

    (async () => {
      try {
        if (isAdmin.value) {
          await store.dispatch('contacts/loadUnreadCount');
        }
      } catch (error) {
        await store.dispatch('notificator/errorResponse', error);
      }
    })();

    watch(items, () => {
      setActiveItem();
    });

    setActiveItem();

    const logout = async () => {
      await store.dispatch('auth/logout', router);
      dialogVisible.value = false;
    };

    const closeDrawer = () => {
      store.commit('setDrawerOpen', false);
    };

    return {
      hoverIndex,
      openDrawer,
      lgAndUp,
      items,
      logout,
      dialogVisible,
      closeDrawer,
      unreadCount,
    };
  },
});
</script>

<style lang="scss" scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.v-navigation-drawer__content {
  border-color: rgba(0, 0, 0, 0.08);

  .v-list {
    .v-list-item {
      &.v-list-item--variant-plain {
        opacity: 1 !important;
      }

      .v-list-item-title {
        color: #999999;
        font-weight: 500;
        font-size: 16px;
      }

      &:hover .v-list-item-title,
      &.v-list-item--active .v-list-item-title {
        color: #1d3557;
      }
    }
  }

  .v-ripple__container {
    display: none !important;
  }

  .v-list-item--link:before {
    background-color: transparent !important;
  }

  .company {
    display: flex;
    justify-content: center;
    display: flex;
    padding: 10px;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .v-list {
    .v-list-item {
      margin: 0 15px;
      border-radius: 16px;
      overflow: hidden;

      &:hover {
        background-color: transparent;
      }
    }
  }

  .dashboard {
    position: relative;
    padding-left: 50px;
    padding-bottom: 0;
    overflow: hidden;
    color: #1d3557;

    .v-icon {
      top: 15px;
      left: 30px;
      position: absolute;
      color: #1d3557;

    }

    .v-list {
      .v-list-item {
        &.v-list-item--variant-plain {
          opacity: 1 !important;
        }

        .v-list-item-title {
          color: #1d3557 !important;
        }


      }
    }
  }

  .submenu {
    position: relative;
    padding-left: 50px;
    padding-bottom: 0;
    overflow: hidden;

    &:has(.v-list-item--active),
    &:hover {

      .v-icon {
        display: block;
        color: #1d3557;
      }

      .divider {
        background-color: #1d3557;
      }
    }

    .divider {
      position: absolute;
      height: calc(100% - 65px);
      width: 2px;
      top: 55px;
      left: 40px;
      background: #cccccc;
      border-radius: 2px;
    }

    .v-icon {
      top: 13px;
      left: 30px;
      position: absolute;
      color: #cccccc;

    }
  }

  .v-list {
    margin: 0;
    padding: 0;

    .v-icon {
      margin-right: 25px;
    }

    .v-list-item-title {
      padding-top: 5px;
    }
  }

  .v-list {
    .v-list-item {
      &.v-list-item--variant-plain {
        opacity: 1 !important;
      }

      .v-list-item-title {
        color: #999999;
        font-weight: 500;
        font-size: 16px;
      }

      &:hover .v-list-item-title,
      &.v-list-item--active .v-list-item-title {
        color: #1d3557;
      }
    }
  }
}
</style>