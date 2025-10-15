export interface MotorcycleImage {
  id: string;
  path: string;
}

export interface Motorcycle {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  modelId: string;
  modelName: string;
  typeId: string;
  typeName: string;
  locationId: string;
  locationName: string;
  userId: string;
  agencyName: string | null;
  year: number;
  price: number;
  cubicCapacity: number;
  kms: number;
  operation: number;
  views: number;
  active: boolean;
  images: MotorcycleImage[];
}

export interface CreateMotorcycleRequest {
  name: string;
  brandId: string;
  modelId: string;
  typeId: string;
  locationId: string;
  userId: string;
  year: number;
  price: number;
  cubicCapacity: number;
  kms: number;
  operation: number;
}

export interface UpdateMotorcycleRequest extends CreateMotorcycleRequest {
  active: boolean;
}

export interface MotorcycleFilterRequest {
  search?: string | null;
  brandId?: string | null;
  modelId?: string | null;
  typeId?: string | null;
  locationId?: string | null;
  userId?: string | null;
  agencyId?: string | null;
  operation?: number | null;
  minYear?: number | null;
  maxYear?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minKms?: number | null;
  maxKms?: number | null;
  minCubicCapacity?: number | null;
  maxCubicCapacity?: number | null;
  active?: boolean | null;
  page?: number;
  pageSize?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedMotorcyclesResponse {
  data: Motorcycle[];
  pagination: PaginationInfo;
}

export interface MotorcycleStatsResponse {
  totalMotorcycles: number;
  activeMotorcycles: number;
  totalBrands: number;
  totalAgencies: number;
  averagePrice: number;
  mostSearchedBrandId: string | null;
  mostSearchedBrandName: string | null;
}

export interface BrandModelSearchItem {
  brandId: string;
  brandName: string;
  modelId: string | null;
  modelName: string | null;
  searchCount: number;
}

export interface TypeSearchItem {
  typeId: string;
  typeName: string;
  searchCount: number;
}

export interface LocationSearchItem {
  locationId: string;
  locationName: string;
  searchCount: number;
}

export interface YearSearchItem {
  year: number;
  searchCount: number;
}

export interface SearchStatsResponse {
  totalSearches: number;
  totalSearchCount: number;
  topBrandModels: BrandModelSearchItem[];
  topTypes: TypeSearchItem[];
  topLocations: LocationSearchItem[];
  topYears: YearSearchItem[];
}

export enum OperationType {
  Sale = 0,
  Rent = 1,
  Both = 2,
}
