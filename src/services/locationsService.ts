import Cookies from "js-cookie";
import { Location, SimpleNameRequest } from "@/types/admin";

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

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export interface LocationListParams {
  search?: string | null;
}

class LocationService {
  async listLocations(params: LocationListParams = {}): Promise<Location[]> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    const query = queryParams.toString();
    const url = `/api/admin/locations${query ? `?${query}` : ""}`;
    return fetchWithAuth(url, { method: "GET" });
  }

  async getLocationById(locationId: string): Promise<Location> {
    return fetchWithAuth(`/api/admin/locations/${locationId}`, {
      method: "GET",
    });
  }

  async createLocation(data: SimpleNameRequest): Promise<Location> {
    return fetchWithAuth(`/api/admin/locations`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLocation(
    locationId: string,
    data: SimpleNameRequest
  ): Promise<Location> {
    return fetchWithAuth(`/api/admin/locations/${locationId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLocation(locationId: string): Promise<void> {
    return fetchWithAuth(`/api/admin/locations/${locationId}`, {
      method: "DELETE",
    });
  }
}

export default new LocationService();
