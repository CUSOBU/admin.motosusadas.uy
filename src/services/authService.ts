import Cookies from "js-cookie";
import store from "@/plugins/store/store";

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

export async function login(phoneNumber: string, pin: string) {
  try {
    const payload = { phoneNumber, pin };
    const data = await postJson(`/auth/login`, payload);

    // Expected shape: { token: string, user: { accessLevel: string, ... } }
    const token = data?.token;
    const user = data?.user;

    if (!token) {
      const err = new ApiError("authentication_failed");
      err.data = data;
      throw err;
    }

    Cookies.set("auth-token", token);

    if (user?.accessLevel !== "admin") {
      const err = new ApiError("access_denied");
      err.data = { message: "access-denied" };
      await store.dispatch("notificator/errorResponse", err);
      throw err;
    }

    return { token, user };
  } catch (error: any) {
    if (!error.customMessage) {
      error.customMessage = error.status ? "server_error" : "network_error";
    }
    await store.dispatch("notificator/errorResponse", error);
    throw error;
  }
}

export async function loginWithPassword(email: string, password: string) {
  try {
    const payload = { email, password };
    const data = await postJson(`/auth/login-password`, payload);

    const token = data?.token;
    const user = data?.user;

    if (!token) {
      const err = new ApiError("authentication_failed");
      err.data = data;
      throw err;
    }

    Cookies.set("auth-token", token);

    if (user?.accessLevel !== "admin") {
      const err = new ApiError("access_denied");
      err.data = { message: "access-denied" };
      await store.dispatch("notificator/errorResponse", err);
      throw err;
    }

    return { token, user };
  } catch (error: any) {
    if (!error.customMessage) {
      error.customMessage = error.status ? "server_error" : "network_error";
    }
    await store.dispatch("notificator/errorResponse", error);
    throw error;
  }
}
