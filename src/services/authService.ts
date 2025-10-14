import Cookies from "js-cookie";
import { LoginResponse } from "@/models/user.model";

class ApiError extends Error {
  status?: number;
  data?: any;
}

const API_BASE = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "");

async function postJson(path: string, body: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = new ApiError("API error");
    err.status = res.status;
    try {
      err.data = await res.json();
    } catch (e) {
      err.data = await res.text();
    }
    throw err;
  }

  return res.json();
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  const payload = { email, password };
  const data: LoginResponse = await postJson(`/api/auth/login`, payload);

  if (!data?.token) {
    const err = new ApiError("authentication_failed");
    err.data = data;
    throw err;
  }

  return data;
}
