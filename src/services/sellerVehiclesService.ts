import Cookies from "js-cookie";
import {
  SellerVehicle,
  UpdateSellerVehicleRequest,
  SellerVehicleFilterRequest,
  PaginatedSellerVehiclesResponse,
  ChangeStatusRequest,
} from "@/models/seller-vehicle.model";

const API_BASE = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "");

class ApiError extends Error {
  status?: number;
  data?: any;
}

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = Cookies.get("auth-token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      Cookies.remove("auth-token");
      window.location.href = "/login";
      const err = new ApiError("Unauthorized");
      err.status = 401;
      err.data = "Unauthorized";
      throw err;
    }

    const err = new ApiError("API error");
    err.status = res.status;
    try {
      const text = await res.text();
      try {
        err.data = JSON.parse(text);
      } catch {
        err.data = text;
      }
    } catch (e) {
      err.data = "Unable to read error response";
    }
    throw err;
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return null;
  }

  return res.json();
}

class SellerVehiclesService {
  /**
   * Get paginated list of approved seller vehicles (Agency & Admin)
   */
  async listApprovedSellerVehicles(
    filters: SellerVehicleFilterRequest = {}
  ): Promise<PaginatedSellerVehiclesResponse> {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.brandId) queryParams.append("brandId", filters.brandId);
    if (filters.modelId) queryParams.append("modelId", filters.modelId);
    if (filters.typeId) queryParams.append("typeId", filters.typeId);
    if (filters.locationId)
      queryParams.append("locationId", filters.locationId);
    if (filters.minYear !== null && filters.minYear !== undefined) {
      queryParams.append("minYear", filters.minYear.toString());
    }
    if (filters.maxYear !== null && filters.maxYear !== undefined) {
      queryParams.append("maxYear", filters.maxYear.toString());
    }
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      queryParams.append("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      queryParams.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters.minKms !== null && filters.minKms !== undefined) {
      queryParams.append("minKms", filters.minKms.toString());
    }
    if (filters.maxKms !== null && filters.maxKms !== undefined) {
      queryParams.append("maxKms", filters.maxKms.toString());
    }
    if (
      filters.minCubicCapacity !== null &&
      filters.minCubicCapacity !== undefined
    ) {
      queryParams.append(
        "minCubicCapacity",
        filters.minCubicCapacity.toString()
      );
    }
    if (
      filters.maxCubicCapacity !== null &&
      filters.maxCubicCapacity !== undefined
    ) {
      queryParams.append(
        "maxCubicCapacity",
        filters.maxCubicCapacity.toString()
      );
    }
    if (filters.page !== undefined) {
      queryParams.append("page", filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      queryParams.append("pageSize", filters.pageSize.toString());
    }

    const query = queryParams.toString();
    const url = `/api/agency/seller-vehicles/approved${
      query ? `?${query}` : ""
    }`;

    return fetchWithAuth(url, { method: "GET" });
  }

  /**
   * Get a single approved seller vehicle by ID (Agency & Admin)
   */
  async getApprovedSellerVehicle(id: string): Promise<SellerVehicle> {
    return fetchWithAuth(`/api/agency/seller-vehicles/approved/${id}`, {
      method: "GET",
    });
  }

  /**
   * Get paginated list of all seller vehicles with filters (Admin only)
   */
  async listAllSellerVehicles(
    filters: SellerVehicleFilterRequest = {}
  ): Promise<PaginatedSellerVehiclesResponse> {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.brandId) queryParams.append("brandId", filters.brandId);
    if (filters.modelId) queryParams.append("modelId", filters.modelId);
    if (filters.typeId) queryParams.append("typeId", filters.typeId);
    if (filters.locationId)
      queryParams.append("locationId", filters.locationId);
    if (filters.status !== null && filters.status !== undefined) {
      queryParams.append("status", filters.status.toString());
    }
    if (filters.minYear !== null && filters.minYear !== undefined) {
      queryParams.append("minYear", filters.minYear.toString());
    }
    if (filters.maxYear !== null && filters.maxYear !== undefined) {
      queryParams.append("maxYear", filters.maxYear.toString());
    }
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      queryParams.append("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      queryParams.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters.minKms !== null && filters.minKms !== undefined) {
      queryParams.append("minKms", filters.minKms.toString());
    }
    if (filters.maxKms !== null && filters.maxKms !== undefined) {
      queryParams.append("maxKms", filters.maxKms.toString());
    }
    if (
      filters.minCubicCapacity !== null &&
      filters.minCubicCapacity !== undefined
    ) {
      queryParams.append(
        "minCubicCapacity",
        filters.minCubicCapacity.toString()
      );
    }
    if (
      filters.maxCubicCapacity !== null &&
      filters.maxCubicCapacity !== undefined
    ) {
      queryParams.append(
        "maxCubicCapacity",
        filters.maxCubicCapacity.toString()
      );
    }
    if (filters.page !== undefined) {
      queryParams.append("page", filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      queryParams.append("pageSize", filters.pageSize.toString());
    }

    const query = queryParams.toString();
    const url = `/api/admin/seller-vehicles${query ? `?${query}` : ""}`;

    return fetchWithAuth(url, { method: "GET" });
  }

  /**
   * Get a single seller vehicle by ID (Admin only)
   */
  async getSellerVehicle(id: string): Promise<SellerVehicle> {
    return fetchWithAuth(`/api/admin/seller-vehicles/${id}`, {
      method: "GET",
    });
  }

  /**
   * Update an existing seller vehicle (Admin only)
   */
  async updateSellerVehicle(
    id: string,
    data: UpdateSellerVehicleRequest
  ): Promise<SellerVehicle> {
    return fetchWithAuth(`/api/admin/seller-vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Change status of a seller vehicle (Admin only)
   */
  async changeStatus(
    id: string,
    data: ChangeStatusRequest
  ): Promise<SellerVehicle> {
    return fetchWithAuth(`/api/admin/seller-vehicles/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a seller vehicle (Admin only)
   */
  async deleteSellerVehicle(id: string): Promise<{ message: string }> {
    return fetchWithAuth(`/api/admin/seller-vehicles/${id}`, {
      method: "DELETE",
    });
  }
}

export default new SellerVehiclesService();
