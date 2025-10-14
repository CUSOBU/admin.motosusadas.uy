import Cookies from "js-cookie";
import { User } from "@/models/user.model";

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

  // Handle 204 No Content
  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export interface UserListParams {
  search?: string | null;
  limit?: number;
  offset?: number;
  active?: boolean | null;
  authLevel?: number | null;
}

export interface UserCreateRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  authLevel: number;
  operation: number;
  agencyId?: string | null;
}

export interface UserUpdateRequest {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  authLevel?: number;
  operation?: number;
  agencyId?: string | null;
  active?: boolean;
}

class UserService {
  async listUsers(params: UserListParams = {}): Promise<User[]> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params.offset !== undefined)
      queryParams.append("offset", params.offset.toString());
    if (params.active !== null && params.active !== undefined) {
      queryParams.append("active", params.active.toString());
    }
    if (params.authLevel !== null && params.authLevel !== undefined) {
      queryParams.append("authLevel", params.authLevel.toString());
    }

    const query = queryParams.toString();
    const url = `/api/admin/users${query ? `?${query}` : ""}`;

    return fetchWithAuth(url, { method: "GET" });
  }

  async getUserById(userId: string): Promise<User> {
    return fetchWithAuth(`/api/admin/users/${userId}`, { method: "GET" });
  }

  async createUser(data: UserCreateRequest): Promise<User> {
    return fetchWithAuth(`/api/admin/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(userId: string, data: UserUpdateRequest): Promise<User> {
    return fetchWithAuth(`/api/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async activateUser(userId: string): Promise<void> {
    return fetchWithAuth(`/api/admin/users/${userId}/activate`, {
      method: "POST",
    });
  }

  async deactivateUser(userId: string): Promise<void> {
    return fetchWithAuth(`/api/admin/users/${userId}/deactivate`, {
      method: "POST",
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return fetchWithAuth(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
  }
}

export default new UserService();
