import Cookies from "js-cookie";
import { Agency, SimpleNameRequest } from "@/types/admin";

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

export interface AgencyListParams {
  search?: string | null;
}

class AgencyService {
  async listAgencies(params: AgencyListParams = {}): Promise<Agency[]> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    const query = queryParams.toString();
    const url = `/api/admin/agencies${query ? `?${query}` : ""}`;
    return fetchWithAuth(url, { method: "GET" });
  }

  async getAgencyById(agencyId: string): Promise<Agency> {
    return fetchWithAuth(`/api/admin/agencies/${agencyId}`, {
      method: "GET",
    });
  }

  async createAgency(data: SimpleNameRequest): Promise<Agency> {
    return fetchWithAuth(`/api/admin/agencies`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAgency(
    agencyId: string,
    data: SimpleNameRequest
  ): Promise<Agency> {
    return fetchWithAuth(`/api/admin/agencies/${agencyId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAgency(agencyId: string): Promise<void> {
    return fetchWithAuth(`/api/admin/agencies/${agencyId}`, {
      method: "DELETE",
    });
  }
}

export default new AgencyService();
