export interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  heading: number;
  accuracy: number;
  loading: boolean;
  error: string | null;
}
