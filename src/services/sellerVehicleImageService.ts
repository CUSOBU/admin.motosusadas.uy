import Cookies from "js-cookie";

const API_BASE = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "");

class ApiError extends Error {
  status?: number;
  data?: any;
}

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = Cookies.get("auth-token");

  const headers: Record<string, string> = options.headers
    ? (options.headers as Record<string, string>)
    : {};

  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Remove Content-Type if it's FormData (browser will set it with boundary)
  if (options.body instanceof FormData && headers["Content-Type"]) {
    delete headers["Content-Type"];
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

  // Handle 204 No Content or empty response
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

class SellerVehicleImageService {
  /**
   * Delete an image from a seller vehicle (Admin only)
   */
  async deleteImage(
    vehicleId: string,
    imageId: string
  ): Promise<{ message: string }> {
    return fetchWithAuth(
      `/api/admin/seller-vehicles/${vehicleId}/images/${imageId}`,
      {
        method: "DELETE",
      }
    );
  }

  /**
   * Remove image helper (compatibility)
   */
  async removeImage(
    vehicleId: string,
    imageId?: string
  ): Promise<{ message: string }> {
    if (!imageId) {
      throw new Error("Image ID is required to delete");
    }
    return this.deleteImage(vehicleId, imageId);
  }
}

export default new SellerVehicleImageService();
