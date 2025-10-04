import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserModel = {
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
};

type UserState = {
  user: UserModel | null;
  setUser: (user: UserModel) => void;
};

export const useUserStore = create(
  persist<UserState>(
    set => ({
      user: null,
      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-data',
    },
  ),
);
