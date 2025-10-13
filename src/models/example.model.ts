// Ejemplo de modelo genérico
// Este archivo sirve como referencia para crear modelos de datos en la aplicación

export interface GenericModel {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export class GenericModelClass implements GenericModel {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;

  constructor(data: Partial<GenericModel>) {
    this.id = data.id || "";
    this.name = data.name || "";
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  toJSON(): GenericModel {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
    };
  }
}
