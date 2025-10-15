import Cookies from "js-cookie";

const API_BASE = (process.env.VUE_APP_API_URL || "").replace(/\/$/, "");

class ApiError extends Error {
  status?: number;
  data?: any;
}

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = Cookies.get("auth-token");

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Formato no permitido. Extensiones válidas: ${allowedExtensions.join(
        ", "
      )}`,
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo permitido (5MB). Tamaño actual: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

class MotorcycleImageService {
  async uploadImages(motorcycleId: string, files: File[]): Promise<any> {
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return fetchWithAuth(`/api/motorcycles/${motorcycleId}/images`, {
      method: "POST",
      body: formData,
    });
  }

  async uploadImage(motorcycleId: string, file: File): Promise<any> {
    return this.uploadImages(motorcycleId, [file]);
  }

  async deleteImage(
    motorcycleId: string,
    imageId: string
  ): Promise<{ message: string }> {
    return fetchWithAuth(`/api/motorcycles/${motorcycleId}/images/${imageId}`, {
      method: "DELETE",
    });
  }

  async removeImage(
    motorcycleId: string,
    imageId?: string
  ): Promise<{ message: string }> {
    if (!imageId) {
      throw new Error("Image ID is required to delete");
    }
    return this.deleteImage(motorcycleId, imageId);
  }
}

export default new MotorcycleImageService();
