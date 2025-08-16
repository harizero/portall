export interface User {
  uid: string;
  email: string;
  displayName: string;
  lastLogin: Date;
  sessionId: string;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  canEmbed: boolean;
  proxyUrl?: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}