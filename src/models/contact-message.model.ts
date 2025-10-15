export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  read: boolean;
  readAt?: string | null;
  userId?: string | null;
  createdAt: string;
  type?: "GENERAL" | "DELETION_REQUEST" | null;
}

export interface ContactMessageFilterRequest {
  page?: number;
  pageSize?: number;
  isRead?: boolean | null;
  search?: string;
  type?: "GENERAL" | "DELETION_REQUEST" | null;
  limit?: number;
  offset?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedContactMessagesResponse {
  data: ContactMessage[];
  pagination: PaginationInfo;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
