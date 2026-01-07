import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Institution = {
  alias: string;
};

type InstitutionState = {
  institution: Institution | null;
  setInstitution: (institution: Institution) => void;
};

export const useInstitutionStore = create(
  persist<InstitutionState>(
    set => ({
      institution: null,
      setInstitution: institution => set({ institution }),
    }),
    {
      name: 'institution-data',
    },
  ),
);
