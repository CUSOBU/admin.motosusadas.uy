import Cookies from "js-cookie";
import { Type, SimpleNameRequest } from "@/types/admin";

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

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export interface TypeListParams {
  search?: string | null;
}

class TypeService {
  async listTypes(params: TypeListParams = {}): Promise<Type[]> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    const query = queryParams.toString();
    const url = `/api/admin/types${query ? `?${query}` : ""}`;
    return fetchWithAuth(url, { method: "GET" });
  }

  async getTypeById(typeId: string): Promise<Type> {
    return fetchWithAuth(`/api/admin/types/${typeId}`, { method: "GET" });
  }

  async createType(data: SimpleNameRequest): Promise<Type> {
    return fetchWithAuth(`/api/admin/types`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateType(typeId: string, data: SimpleNameRequest): Promise<Type> {
    return fetchWithAuth(`/api/admin/types/${typeId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteType(typeId: string): Promise<void> {
    return fetchWithAuth(`/api/admin/types/${typeId}`, {
      method: "DELETE",
    });
  }
}

export default new TypeService();
