import Cookies from "js-cookie";
import {
  Motorcycle,
  CreateMotorcycleRequest,
  UpdateMotorcycleRequest,
  MotorcycleFilterRequest,
  PaginatedMotorcyclesResponse,
  MotorcycleStatsResponse,
  SearchStatsResponse,
} from "@/models/motorcycle.model";

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
    // Handle 401 Unauthorized - logout and redirect to login
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

class MotorcyclesService {
  /**
   * Get paginated list of motorcycles with filters
   */
  async listMotorcycles(
    filters: MotorcycleFilterRequest = {}
  ): Promise<PaginatedMotorcyclesResponse> {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("search", filters.search);
    if (filters.brandId) queryParams.append("brandId", filters.brandId);
    if (filters.modelId) queryParams.append("modelId", filters.modelId);
    if (filters.typeId) queryParams.append("typeId", filters.typeId);
    if (filters.locationId)
      queryParams.append("locationId", filters.locationId);
    if (filters.agencyId) queryParams.append("agencyId", filters.agencyId);
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
    if (filters.active !== null && filters.active !== undefined) {
      queryParams.append("active", filters.active.toString());
    }
    if (filters.page !== undefined) {
      queryParams.append("page", filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      queryParams.append("pageSize", filters.pageSize.toString());
    }

    const query = queryParams.toString();
    const url = `/api/motorcycles${query ? `?${query}` : ""}`;

    return fetchWithAuth(url, { method: "GET" });
  }

  /**
   * Get a single motorcycle by ID
   */
  async getMotorcycle(id: string): Promise<Motorcycle> {
    return fetchWithAuth(`/api/motorcycles/${id}`, { method: "GET" });
  }

  /**
   * Create a new motorcycle
   */
  async createMotorcycle(data: CreateMotorcycleRequest): Promise<Motorcycle> {
    return fetchWithAuth("/api/motorcycles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update an existing motorcycle
   */
  async updateMotorcycle(
    id: string,
    data: UpdateMotorcycleRequest
  ): Promise<Motorcycle> {
    return fetchWithAuth(`/api/motorcycles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Toggle featured status for a motorcycle
   */
  async toggleFeatured(id: string, isFeatured: boolean): Promise<void> {
    await fetchWithAuth(`/api/motorcycles/${id}/featured`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured }),
    });
  }

  /**
   * Delete/deactivate a motorcycle
   */
  async deleteMotorcycle(id: string): Promise<{ message: string }> {
    return fetchWithAuth(`/api/motorcycles/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Get motorcycle statistics
   */
  async getStats(): Promise<MotorcycleStatsResponse> {
    return fetchWithAuth("/api/motorcycles/stats/summary", { method: "GET" });
  }

  /**
   * Get search statistics
   */
  async getSearchStats(): Promise<SearchStatsResponse> {
    return fetchWithAuth("/api/searches/stats", { method: "GET" });
  }
}

export default new MotorcyclesService();
