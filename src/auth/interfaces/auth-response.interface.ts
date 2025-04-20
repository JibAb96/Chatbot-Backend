export interface AuthResponse {
  id: string;
  email?: string;
  token: string;
  refreshToken: string;
}
