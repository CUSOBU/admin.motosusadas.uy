import store from "@/plugins/store/store";
import Cookies from "js-cookie";

export interface ImageUploadConfig {
  endpoint: string;
  deleteEndpoint?: string;
  idFieldName: string;
  responseImageField: string;
}

export interface BaseImageUploadResponse {
  [key: string]: any;
  imageUrl?: string;
}

export class BaseImageService {
  protected apiBaseUrl: string;
  protected authToken: string | null = null;
  protected config: ImageUploadConfig;

  constructor(config: ImageUploadConfig) {
    const apiUrl = process.env.VUE_APP_API_URL || "";
    this.apiBaseUrl = apiUrl.replace(/\/$/, "");
    this.config = config;
    this.setAuthTokenFromStore();
  }

  protected setAuthTokenFromStore() {
    try {
      const token = Cookies.get("auth-token");
      if (token) {
        this.authToken = token;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  async uploadImage(
    entityId: string,
    imageFile: File
  ): Promise<BaseImageUploadResponse> {
    try {
      this.setAuthTokenFromStore();

      if (!this.authToken) {
        throw new Error("Authentication token not found");
      }

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append(this.config.idFieldName, entityId);

      const response = await fetch(
        `${this.apiBaseUrl}${this.config.endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || "Unknown error" };
        }

        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      const imageField = result[this.config.responseImageField];
      if (imageField) {
        result.imageUrl = imageField;
      }

      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async remove(id: string): Promise<any> {
    try {
      this.setAuthTokenFromStore();

      if (!this.authToken) {
        throw new Error("Authentication token not found");
      }

      const deleteUrl = this.config.deleteEndpoint
        ? `${this.apiBaseUrl}${this.config.deleteEndpoint}/${id}`
        : `${this.apiBaseUrl}${this.config.endpoint.replace("{id}", id)}`;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    } catch (error: any) {
      throw error;
    }
  }
}
