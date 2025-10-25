export interface User {
  id: string;
  email: string;
  fullName: string;
  authLevel: number;
  phoneNumber?: string;
  agencyId: string;
  agencyName: string;
  active: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}
