<template>
  <v-container fluid class="py-0">
    <Heading>
      <template #title>
        <div class="d-flex align-center">
          <v-btn icon variant="text" @click="goBack" class="mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div>
            <h2>{{ $t("contact-message-details") }}</h2>
            <p>{{ $t("contact-message-details-sub-heading") }}</p>
          </div>
        </div>
      </template>
      <template #actions>
        <v-chip :color="contact?.read ? 'success' : 'primary'" variant="outlined" v-if="contact">
          {{ contact.read ? $t("read") : $t("unread") }}
        </v-chip>
      </template>
    </Heading>
    <v-container fluid>
      <v-row v-if="contact">
        <v-col cols="6">
          <attribute>
            <template #name>{{ $t("name") }}</template>
            {{ contact.name }}
          </attribute>
        </v-col>
        <v-col cols="6" class="svg-buttons small-buttons text-right">
          <v-btn 
            small 
            icon 
            class="pl-0 pr-0 mr-2"
            :color="contact.read ? 'grey' : 'primary'"
            @click="toggleReadStatus"
            :loading="isTogglingStatus"
          >
            <v-icon>{{ contact.read ? 'mdi-email-open-outline' : 'mdi-email-alert' }}</v-icon>
          </v-btn>
          <RemoveDialog :item="contact" @removed="remove"></RemoveDialog>
        </v-col>
      </v-row>
      <v-row class="bottom-lined" v-if="contact">
        <v-col cols="6">
          <attribute>
            <template #name>{{ $t("email") }}</template>
            {{ contact.email }}
            <v-chip v-if="contact.userId" color="primary" size="small" class="ml-2" variant="outlined">
              {{ $t("system-user") }}
            </v-chip>
          </attribute>
        </v-col>
        <v-col cols="6" v-if="contact.phone">
          <attribute>
            <template #name>{{ $t("phone") }}</template>
            {{ contact.phone }}
          </attribute>
        </v-col>
        <v-col cols="12" v-if="contact.subject">
          <attribute>
            <template #name>{{ $t("subject") }}</template>
            {{ contact.subject }}
          </attribute>
        </v-col>
        <v-col cols="12">
          <attribute>
            <template #name>{{ $t("message") }}</template>
            <p class="mt-2 message-text">{{ contact.message }}</p>
          </attribute>
        </v-col>
        <v-col cols="6">
          <attribute>
            <template #name>{{ $t("received-at") }}</template>
            {{ formatDate(contact.createdAt) }}
          </attribute>
        </v-col>
        <v-col cols="6" v-if="contact.readAt">
          <attribute>
            <template #name>{{ $t("read-at") }}</template>
            {{ formatDate(contact.readAt) }}
          </attribute>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Heading from "@/views/components/Heading.vue";
import { useRouter, useRoute } from 'vue-router';
import { ContactMessage } from '@/models/contact-message.model';
import Attribute from '../components/Attribute.vue';
import RemoveDialog from './RemoveDialogContact.vue';

export default {
  components: {
    Heading,
    Attribute,
    RemoveDialog,
  },

  setup() {
    const store = useStore();
    const contact = ref<ContactMessage | null>(null);
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref<boolean>(true);
    const isTogglingStatus = ref<boolean>(false);

    const remove = async () => {
      try {
        if (contact.value) {
          await store.dispatch('contacts/deleteContact', contact.value.id);
          router.push({ name: 'contact-messages' });
        }
      } catch (error) {
        store.dispatch("notificator/errorResponse", error);
      }
    };

    const loadContact = async (id: string) => {
      try {
        const fetchedContact = await store.dispatch('contacts/loadContact', id);
        contact.value = fetchedContact;

        if (fetchedContact && !fetchedContact.read) {
          await store.dispatch('contacts/markAsRead', id);
          const updatedContact = await store.dispatch('contacts/loadContact', id);
          contact.value = updatedContact;
        }
      } catch (error) {
        store.dispatch("notificator/errorResponse", error);
        contact.value = null;
      }
    };

    const toggleReadStatus = async () => {
      if (!contact.value) return;
      
      try {
        isTogglingStatus.value = true;
        if (contact.value.read) {
          await store.dispatch('contacts/markAsUnread', contact.value.id);
        } else {
          await store.dispatch('contacts/markAsRead', contact.value.id);
        }
        // Reload contact
        const updatedContact = await store.dispatch('contacts/loadContact', contact.value.id);
        contact.value = updatedContact;
      } catch (error) {
        store.dispatch("notificator/errorResponse", error);
      } finally {
        isTogglingStatus.value = false;
      }
    };

    const goBack = () => {
      router.push({ name: 'contact-messages' });
    };

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleString('es-UY', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    };

    onMounted(async () => {
      store.dispatch('SET_LOADING', true);
      const id = route.params.id;
      if (typeof id === 'string') {
        await loadContact(id);
      }
      store.dispatch('SET_LOADING', false);
      isLoading.value = false;
    });

    watch(() => route.params.id, async (newId) => {
      if (typeof newId === 'string') {
        await loadContact(newId);
      }
    });

    return {
      contact,
      remove,
      isLoading,
      isTogglingStatus,
      router,
      toggleReadStatus,
      goBack,
      formatDate,
    };
  },
}
</script>

<style scoped lang="scss">
.fg-primary {
  color: #1976D2;

  &:hover {
    opacity: 0.8;
  }
}

.v-chip {
  font-size: 0.75rem;
  height: 20px !important;
}

.bottom-lined {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.message-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>