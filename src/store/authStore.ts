import { create } from 'zustand';
import { User } from '../types/auth';

interface Credentials {
  admin: {
    username: string;
    password: string;
  };
  user: {
    username: string;
    password: string;
  };
}

interface AuthState {
  user: User | null;
  credentials: Credentials;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (newUsername: string, newPassword: string, userType: 'admin' | 'user') => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  credentials: {
    admin: {
      username: 'admin',
      password: 'corteybelleza6'
    },
    user: {
      username: 'user',
      password: 'mastervendedor'
    }
  },
  login: (username: string, password: string) => {
    const { credentials } = get();
    if (username === credentials.admin.username && password === credentials.admin.password) {
      set({ user: { username, role: 'admin', isAuthenticated: true } });
      return true;
    }
    if (username === credentials.user.username && password === credentials.user.password) {
      set({ user: { username, role: 'user', isAuthenticated: true } });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
  updateCredentials: (newUsername: string, newPassword: string, userType: 'admin' | 'user') => {
    set((state) => ({
      credentials: {
        ...state.credentials,
        [userType]: {
          username: newUsername,
          password: newPassword
        }
      },
      // Update current user if changing their own credentials
      user: state.user?.role === userType ? 
        { ...state.user, username: newUsername } : 
        state.user
    }));
  },
}));