export interface ContactInfo {
  id?: string;
  phoneNumber: string;
  location: string;
  schedule: string;
}

export interface UpdateContactInfoRequest {
  id?: string;
  phoneNumber: string;
  location: string;
  schedule: string;
}
