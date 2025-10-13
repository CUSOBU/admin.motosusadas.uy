<template>
  <v-container fluid class="py-0">
    <heading />
    <v-card class="mt-5">
      <v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <h3>{{ $t("example-table") }}</h3>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn color="primary" prepend-icon="mdi-plus">
              {{ $t("new-item") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <datatable
          :headers="headers"
          :items="items"
          :page="pagination.page"
          :items-per-page="pagination.itemsPerPage"
          :total-items="pagination.totalItems"
          @update:options="handleUpdateOptions"
        >
          <template #item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </datatable>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import Datatable from '../components/Datatable.vue';
import Heading from '../components/Heading.vue';

export default {
  components: {
    Datatable,
    Heading,
  },
  setup() {
    const headers = ref([
      { title: 'ID', key: 'id', sortable: true },
      { title: 'Nombre', key: 'name', sortable: true },
      { title: 'Email', key: 'email', sortable: true },
      { title: 'Estado', key: 'status', sortable: true },
      { title: 'Acciones', key: 'actions', sortable: false },
    ]);

    const items = ref([
      { id: 1, name: 'Usuario 1', email: 'user1@example.com', status: 'Activo' },
      { id: 2, name: 'Usuario 2', email: 'user2@example.com', status: 'Inactivo' },
      { id: 3, name: 'Usuario 3', email: 'user3@example.com', status: 'Activo' },
      { id: 4, name: 'Usuario 4', email: 'user4@example.com', status: 'Activo' },
      { id: 5, name: 'Usuario 5', email: 'user5@example.com', status: 'Inactivo' },
    ]);

    const pagination = reactive({
      page: 1,
      itemsPerPage: 10,
      totalItems: 5,
    });

    const handleUpdateOptions = (options: any) => {
      pagination.page = options.page;
      pagination.itemsPerPage = options.itemsPerPage;
      // Aquí irían las llamadas a la API para obtener datos
      console.log('Opciones actualizadas:', options);
    };

    const editItem = (item: any) => {
      console.log('Editar:', item);
      // Lógica de edición
    };

    const deleteItem = (item: any) => {
      console.log('Eliminar:', item);
      // Lógica de eliminación
    };

    return {
      headers,
      items,
      pagination,
      handleUpdateOptions,
      editItem,
      deleteItem,
    };
  },
};
</script>
