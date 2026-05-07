// types/google-maps.ts
export interface MapPoint {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  rating?: number;
  temperature?: number;
  icon?: string;
  type?: string; // Optionnel, pour catégoriser les points
  population?: number;
  region?: string;
}

export interface RouteSegment {
  from: MapPoint;
  to: MapPoint;
  color: string;
  width: number;
  label?: string;
}
