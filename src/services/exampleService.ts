// Ejemplo de servicio genérico
// Este archivo sirve como referencia para crear servicios en la aplicación

import { GenericModel } from "@/models/example.model";

export class ExampleService {
  private baseURL = process.env.VUE_APP_API_URL || "http://localhost:3000/api";

  // Ejemplo de método GET
  async getAll(): Promise<GenericModel[]> {
    try {
      const response = await fetch(`${this.baseURL}/items`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en getAll:", error);
      throw error;
    }
  }

  // Ejemplo de método GET por ID
  async getById(id: string | number): Promise<GenericModel> {
    try {
      const response = await fetch(`${this.baseURL}/items/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener el dato");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en getById:", error);
      throw error;
    }
  }

  // Ejemplo de método POST
  async create(data: Partial<GenericModel>): Promise<GenericModel> {
    try {
      const response = await fetch(`${this.baseURL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error al crear el dato");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en create:", error);
      throw error;
    }
  }

  // Ejemplo de método PUT
  async update(
    id: string | number,
    data: Partial<GenericModel>
  ): Promise<GenericModel> {
    try {
      const response = await fetch(`${this.baseURL}/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar el dato");
      }
      return await response.json();
    } catch (error) {
      console.error("Error en update:", error);
      throw error;
    }
  }

  // Ejemplo de método DELETE
  async delete(id: string | number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/items/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el dato");
      }
    } catch (error) {
      console.error("Error en delete:", error);
      throw error;
    }
  }
}

export default new ExampleService();
