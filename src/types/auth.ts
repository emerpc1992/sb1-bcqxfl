export interface User {
  username: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}