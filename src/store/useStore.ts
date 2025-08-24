import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  image: string | null;
  country: string;
  createdAt: Date;
}

interface Store {
  formData: FormData[];
  countries: string[];
  modals: {
    uncontrolled: boolean;
    hookForm: boolean;
  };
  addFormData: (data: Omit<FormData, 'id' | 'createdAt'>) => void;
  openModal: (modal: 'uncontrolled' | 'hookForm') => void;
  closeModal: (modal: 'uncontrolled' | 'hookForm') => void;
}

export const useStore = create<Store>()(
  devtools((set) => ({
    formData: [],
    countries: [
      'United States',
      'Canada',
      'Mexico',
      'Brazil',
      'United Kingdom',
      'Germany',
      'France',
      'Italy',
      'Spain',
      'Australia',
      'Japan',
      'China',
    ],
    modals: {
      uncontrolled: false,
      hookForm: false,
    },
    addFormData: (data) =>
      set((state) => ({
        formData: [
          ...state.formData,
          {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
          },
        ],
      })),
    openModal: (modal) =>
      set((state) => ({
        modals: { ...state.modals, [modal]: true },
      })),
    closeModal: (modal) =>
      set((state) => ({
        modals: { ...state.modals, [modal]: false },
      })),
  }))
);
