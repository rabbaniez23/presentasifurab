import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  role: 'user' | 'driver' | null;
  vehicle?: { plate: string; type: 'motorcycle' | 'car' };
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  setRole: (role: 'user' | 'driver') => void;
  setVehicle: (vehicle: { plate: string; type: 'motorcycle' | 'car' }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  role: null,
  vehicle: undefined,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setVehicle: (vehicle) => set({ vehicle }),
  logout: () => set({ token: null, user: null, role: null, vehicle: undefined }),
}));
