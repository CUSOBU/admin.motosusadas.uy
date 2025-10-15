<template>
  <v-row class="payment-filters">
    <v-col cols="12" class="py-0">
      <datatable :headers="headers" :items="contacts" :items-per-page="itemsPerPage" :total-items="total" :page="page"
        @update:options="handlePageChange" class="v-data-table--in-row-headers" headerless>
        <template v-slot:item.status="{ item }">
          <v-btn small icon class="status-icon" @click.stop="!item.read && markAsRead(item.id)">
            <v-icon :color="item.read ? 'grey' : '#1976D2'" size="20">
              {{ item.read ? 'mdi-email-open-outline' : 'mdi-email-alert' }}
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.name="{ item }">
          <span class="field-label">{{ $t('name') }}</span>
          <span :class="{ 'unread-text': !item.read }" @click="info(item.id)">
            {{ item.name }}
            <v-icon v-if="!item.read" color="#1976D2" size="12" class="unread-dot">mdi-circle</v-icon>
          </span>
        </template>

        <template v-slot:item.email="{ item }">
          <span class="field-label">{{ $t('email') }}</span>
          <span :class="{ 'unread-text': !item.read }" @click="info(item.id)">{{ item.email }}</span>
        </template>

        <template v-slot:item.subject="{ item }">
          <span class="field-label">{{ $t('subject') }}</span>
          <span :class="{ 'unread-text': !item.read }" @click="info(item.id)">{{ item.subject }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="payment-buttons buttons buttons--4" style="white-space: nowrap">
            <v-btn small icon class="pl-0 pr-0 fg-primary" @click.stop="info(item.id)">
              <v-icon max-width="22px">mdi-information-outline</v-icon>
            </v-btn>
            <RemoveDialog :item="item" @removed="reload"></RemoveDialog>
          </div>
        </template>
      </datatable>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import router from "@/router";
import Datatable from "../components/Datatable.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from 'vuex';
import { PropType } from 'vue';
import RemoveDialog from "./RemoveDialogContact.vue";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  readAt: string;
  userId: string;
}

interface Props {
  search: string;
  active: boolean | null;
  type: 'GENERAL' | 'DELETION_REQUEST' | null;
}

export default {
  components: {
    Datatable,
    RemoveDialog
  },
  props: {
    search: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean as PropType<boolean | null>,
      default: null
    },
    type: {
      type: String as PropType<'GENERAL' | 'DELETION_REQUEST' | null>,
      default: null
    }
  },

  setup(props: Props) {
    const store = useStore();
    const contacts = computed(() => store.state.contacts.contacts);
    const total = computed(() => store.state.contacts.total);
    const page = ref(1);
    const itemsPerPage = ref(10);

    const loadContacts = async (options: any = {}) => {
      try {
        const params = {
          isRead: props.active,
          search: props.search || undefined,
          type: props.type || undefined,
          page: options.page || page.value,
          pageSize: options.itemsPerPage || itemsPerPage.value,
        };

        await store.dispatch('contacts/loadContacts', params);
      } catch (error) {
        store.dispatch('notificator/errorResponse', error);
      }
    };

    const handlePageChange = async (options: any) => {
      page.value = options.page;
      itemsPerPage.value = options.itemsPerPage;
      await loadContacts(options);
    };

    const reload = () => {
      loadContacts({
        page: page.value,
        itemsPerPage: itemsPerPage.value
      });
    };

    watch([() => props.search, () => props.active, () => props.type], () => {
      page.value = 1;
      loadContacts({
        page: page.value,
        itemsPerPage: itemsPerPage.value
      });
    });

    onMounted(() => {
      loadContacts({
        page: page.value,
        itemsPerPage: itemsPerPage.value
      });
    });

    const headers = computed(() => [
      {
        title: "Estado",
        value: "status",
        align: "center",
        sortable: false,
        width: "50px"
      },
      {
        title: "Nombre",
        value: "name",
        align: "start",
        sortable: false,
      },
      {
        title: "Email",
        value: "email",
        align: "start",
        sortable: false,
      },
      {
        title: "Asunto",
        value: "subject",
        align: "start",
        sortable: false,
      },
      {
        title: 'Acciones',
        value: 'actions',
        align: 'center',
        sortable: false,
      },
    ]);

    const info = (id: string) => {
      router.push({ name: 'contact-messages-details', params: { id } });
    };

    const markAsRead = async (id: string) => {
      await store.dispatch('contacts/markAsRead', id);
      await reload();
    };

    return {
      headers,
      contacts,
      info,
      markAsRead,
      reload,
      total,
      page,
      itemsPerPage,
      handlePageChange,
    };
  }
};
</script>

<style scoped lang="scss">
.read-row {
  background-color: #f5f5f5 !important;
  opacity: 0.8;

  td {
    color: #757575 !important;
  }
}

.unread-row {
  background-color: #E3F2FD !important;
  font-weight: 500;

  td {
    color: #1976D2 !important;
  }
}

.field-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.unread-text {
  color: #5586A5 !important;
  font-weight: 600;
}

.unread-dot {
  margin-left: 4px;
  margin-bottom: 2px;
}

.unread-border {
  border-left: 3px solid #1976D2 !important;

}

.status-icon {
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    opacity: 0.8;
    background-color: rgba(25, 118, 210, 0.04);
  }
}

 :deep(.v-data-table) {
  tbody {
    tr {
      transition: all 0.2s ease;

      &:hover {
        background-color: #f5f5f5 !important;
      }
    }
  }
}

tr {
  cursor: pointer;

  &:hover {
    background-color: rgba(25, 118, 210, 0.04) !important;
  }
}
</style>