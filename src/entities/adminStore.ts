import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AdminUser = {
  username: string;
};

type AdminState = {
  admin: AdminUser | null;
  setAdmin: (admin: AdminUser) => void;
  clearAdmin: () => void;
};

export const useAdminStore = create(
  persist<AdminState>(
    set => ({
      admin: null,
      setAdmin: admin => set({ admin }),
      clearAdmin: () => set({ admin: null }),
    }),
    { name: 'admin-auth' },
  ),
);
