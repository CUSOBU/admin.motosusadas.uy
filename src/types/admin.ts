// Tipos para las entidades del sistema admin

export interface SimpleEntity {
  id: string;
  name: string;
}

export interface Location extends SimpleEntity {}

export interface Agency extends SimpleEntity {}

export interface Type extends SimpleEntity {}

export interface Brand extends SimpleEntity {
  models?: Model[];
}

export interface Model {
  id: string;
  name: string;
  brandId: string;
  brand?: Brand;
}

export type SimpleNameRequest = {
  name: string;
};

export type ModelRequest = {
  name: string;
  brandId: string;
};
