import Cookies from "js-cookie";
import {
  ContactInfo,
  UpdateContactInfoRequest,
} from "@/models/contact-info.model";

const API_BASE_URL = process.env.VUE_APP_API_URL || "http://localhost:7051";

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const token = Cookies.get("auth-token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - logout and redirect to login
    if (response.status === 401) {
      Cookies.remove("auth-token");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

class ContactInfoService {
  async getContactInfo(): Promise<ContactInfo> {
    const response = await fetchWithAuth("/api/contact-info", {
      method: "GET",
    });

    return await response.json();
  }

  async updateContactInfo(
    data: UpdateContactInfoRequest
  ): Promise<ContactInfo> {
    const response = await fetchWithAuth("/api/contact-info", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: data.id,
        phoneNumber: data.phoneNumber,
        location: data.location,
        schedule: data.schedule,
      }),
    });

    return await response.json();
  }
}

export default new ContactInfoService();
