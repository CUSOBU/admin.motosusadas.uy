export interface SellerVehicleImage {
  id: string;
  path: string;
}

export enum SellerVehicleStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Contacted = 3,
}

export interface SellerVehicle {
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
  year: number;
  price: number;
  cubicCapacity: number;
  kms: number;
  description: string;
  status: SellerVehicleStatus;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  images: SellerVehicleImage[];
}

export interface CreateSellerVehicleRequest {
  name: string;
  brandId: string;
  modelId: string;
  typeId: string;
  locationId: string;
  year: number;
  price: number;
  cubicCapacity: number;
  kms: number;
  description: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
}

export interface UpdateSellerVehicleRequest {
  name: string;
  brandId: string;
  modelId: string;
  typeId: string;
  locationId: string;
  year: number;
  price: number;
  cubicCapacity: number;
  kms: number;
  description: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  adminNotes?: string;
}

export interface ChangeStatusRequest {
  status: SellerVehicleStatus;
  adminNotes?: string;
}

export interface SellerVehicleFilterRequest {
  search?: string | null;
  brandId?: string | null;
  modelId?: string | null;
  typeId?: string | null;
  locationId?: string | null;
  status?: SellerVehicleStatus | null;
  minYear?: number | null;
  maxYear?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minKms?: number | null;
  maxKms?: number | null;
  minCubicCapacity?: number | null;
  maxCubicCapacity?: number | null;
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

export interface PaginatedSellerVehiclesResponse {
  data: SellerVehicle[];
  pagination: PaginationInfo;
}
