import Cookies from "js-cookie";
import {
  ContactMessage,
  ContactMessageFilterRequest,
  PaginatedContactMessagesResponse,
  UnreadCountResponse,
} from "@/models/contact-message.model";

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

class ContactService {
  async getMessages(
    filters: ContactMessageFilterRequest = {}
  ): Promise<PaginatedContactMessagesResponse> {
    const queryParams = new URLSearchParams();

    if (filters.page !== undefined) {
      queryParams.append("page", filters.page.toString());
    }
    if (filters.pageSize !== undefined) {
      queryParams.append("pageSize", filters.pageSize.toString());
    }
    if (filters.isRead !== null && filters.isRead !== undefined) {
      queryParams.append("isRead", filters.isRead.toString());
    }
    if (filters.search) {
      queryParams.append("search", filters.search);
    }
    if (filters.type) {
      queryParams.append("type", filters.type);
    }

    const query = queryParams.toString();
    const url = `/api/admin/contact-messages${query ? `?${query}` : ""}`;

    const response = await fetchWithAuth(url, { method: "GET" });

    if (response.data) {
      response.data = response.data.map((msg: ContactMessage) => ({
        ...msg,
        read: msg.isRead,
      }));
    }

    return response;
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return fetchWithAuth("/api/admin/contact-messages/unread-count", {
      method: "GET",
    });
  }

  async getMessage(id: string): Promise<ContactMessage> {
    const message = await fetchWithAuth(`/api/admin/contact-messages/${id}`, {
      method: "GET",
    });

    return {
      ...message,
      read: message.isRead,
    };
  }

  async markAsRead(
    id: string,
    isRead: boolean = true
  ): Promise<ContactMessage> {
    const queryParams = new URLSearchParams();
    queryParams.append("isRead", isRead.toString());

    const message = await fetchWithAuth(
      `/api/admin/contact-messages/${id}/mark-as-read?${queryParams.toString()}`,
      {
        method: "PATCH",
      }
    );

    return {
      ...message,
      read: message.isRead,
    };
  }

  async deleteMessage(id: string): Promise<{ message: string }> {
    return fetchWithAuth(`/api/admin/contact-messages/${id}`, {
      method: "DELETE",
    });
  }

  async getContact(id: string): Promise<ContactMessage> {
    return this.getMessage(id);
  }
}

export default new ContactService();
