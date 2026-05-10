import { create } from 'zustand';
import { Coordinates } from '../types/route.types';

interface LocationStore {
  coords: Coordinates | null;
  heading: number;
  accuracy: number;
  setLocation: (coords: Coordinates, heading: number, accuracy: number) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  coords: null,
  heading: 0,
  accuracy: 0,
  setLocation: (coords, heading, accuracy) =>
    set({ coords, heading, accuracy }),
}));
