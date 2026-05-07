// components/GoogleMapComponent.tsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Polyline,
  Marker,
  InfoWindow,
  useLoadScript,
  Libraries,
} from "@react-google-maps/api";
import { MapPoint, RouteSegment } from "@/types/google-maps";

const libraries: Libraries = ["places", "geometry"];

interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  points?: MapPoint[];
  routeSegments?: RouteSegment[];
  mapContainerStyle?: React.CSSProperties;
  restrictToCongo?: boolean;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center = { lat: -1.0, lng: 15.0 }, // Centre du Congo
  zoom = 6, // Zoom pour voir tout le pays
  points = [],
  routeSegments = [],
  mapContainerStyle = { width: "100%", height: "500px" },
  restrictToCongo = true,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Définir les limites géographiques du Congo
  const congoBounds = useMemo(
    () => ({
      north: 3.7, // Limite nord (Région de la Sangha)
      south: -5.0, // Limite sud (Frontière avec l'Angola/Cabinda)
      east: 18.6, // Limite est (Région de la Likouala)
      west: 11.0, // Limite ouest (Côte Atlantique)
    }),
    [],
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyCPbkiSVTKPYsUNr2udebKOS4PVXDz6x2s",
    libraries,
  });

  const defaultPoints = useMemo<MapPoint[]>(
    () => [
      {
        lat: -4.2634, // Brazzaville
        lng: 15.2429,
        title: "Brazzaville",
        description: "Capitale du Congo",
        rating: 4.5,
        temperature: 305,
        icon: "🏛️",
        type: "capital",
      },
      {
        lat: -4.7792, // Pointe-Noire
        lng: 11.8636,
        title: "Pointe-Noire",
        description: "Port principal économique",
        rating: 4.3,
        temperature: 310,
        icon: "⚓",
        type: "port",
      },
      {
        lat: -4.1983, // Dolisie (Loubomo)
        lng: 12.6664,
        title: "Dolisie",
        description: "Centre administratif",
        rating: 4.0,
        temperature: 300,
        icon: "🏘️",
        type: "city",
      },
      {
        lat: -4.1833, // Nkayi
        lng: 13.2833,
        title: "Nkayi",
        description: "Ville agricole importante",
        rating: 3.9,
        temperature: 302,
        icon: "🌾",
        type: "agricultural",
      },
      {
        lat: 1.6136, // Ouesso
        lng: 16.0517,
        title: "Ouesso",
        description: "Port fluvial du nord",
        rating: 3.7,
        temperature: 295,
        icon: "🛶",
        type: "northern",
      },
      {
        lat: 1.6381, // Impfondo
        lng: 18.0667,
        title: "Impfondo",
        description: "Capitale de la Likouala",
        rating: 3.8,
        temperature: 298,
        icon: "🌳",
        type: "northern",
      },
    ],
    [],
  );

  // Segments de route entre ces villes
  const defaultRouteSegments = useMemo<RouteSegment[]>(
    () => [
      {
        from: defaultPoints[0], // Brazzaville
        to: defaultPoints[1], // Pointe-Noire
        color: "#DC2626", // Rouge vif
        width: 4,
        label: "Brazzaville - Pointe-Noire",
      },
      {
        from: defaultPoints[2], // Dolisie
        to: defaultPoints[3], // Nkayi
        color: "#059669", // Vert émeraude
        width: 3,
        label: "Dolisie - Nkayi",
      },
      {
        from: defaultPoints[4], // Ouesso
        to: defaultPoints[5], // Impfondo
        color: "#2563EB", // Bleu royal
        width: 3,
        label: "Ouesso - Impfondo",
      },
    ],
    [defaultPoints],
  );

  const displayPoints = points.length > 0 ? points : defaultPoints;
  const displaySegments =
    routeSegments.length > 0 ? routeSegments : defaultRouteSegments;

  const handleMarkerClick = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedPoint(null);
  }, []);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      if (restrictToCongo) {
        // Créer des limites qui incluent tous les points mais restent dans le Congo
        const bounds = new google.maps.LatLngBounds();
        displayPoints.forEach((point) => bounds.extend(point));

        // S'assurer que les limites ne dépassent pas celles du Congo
        const south = Math.max(bounds.getSouthWest().lat(), congoBounds.south);
        const west = Math.max(bounds.getSouthWest().lng(), congoBounds.west);
        const north = Math.min(bounds.getNorthEast().lat(), congoBounds.north);
        const east = Math.min(bounds.getNorthEast().lng(), congoBounds.east);

        const finalBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(south, west),
          new google.maps.LatLng(north, east),
        );

        map.fitBounds(finalBounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        });

        // Restreindre la vue aux limites du Congo
        map.setOptions({
          restriction: {
            latLngBounds: {
              north: congoBounds.north,
              south: congoBounds.south,
              east: congoBounds.east,
              west: congoBounds.west,
            },
            strictBounds: true,
          },
          minZoom: 5, // Zoom minimum pour éviter de trop dézoomer
        });
      } else {
        // Si pas de restriction, utiliser le comportement normal
        const bounds = new google.maps.LatLngBounds();
        displayPoints.forEach((point) => bounds.extend(point));
        displaySegments.forEach((segment) => {
          bounds.extend(segment.from);
          bounds.extend(segment.to);
        });
        map.fitBounds(bounds);
      }
    },
    [displayPoints, displaySegments, restrictToCongo, congoBounds],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fonction pour créer des symboles personnalisés avec couleurs par type
  const createCustomIcon = useCallback((point: MapPoint) => {
    let fillColor = "#4285F4"; // Bleu par défaut

    if (point.type === "capital") fillColor = "#DC2626"; // Rouge
    if (point.type === "port") fillColor = "#059669"; // Vert
    if (point.type === "agricultural") fillColor = "#D97706"; // Orange
    if (point.type === "northern") fillColor = "#7C3AED"; // Violet

    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: point.type === "capital" ? 10 : 8,
      fillColor: fillColor,
      fillOpacity: 0.9,
      strokeColor: "#FFFFFF",
      strokeWeight: point.type === "capital" ? 3 : 2,
    };
  }, []);

  // Effet pour recentrer la carte si les points changent
  useEffect(() => {
    if (map && restrictToCongo) {
      const bounds = new google.maps.LatLngBounds();
      displayPoints.forEach((point) => bounds.extend(point));

      const south = Math.max(bounds.getSouthWest().lat(), congoBounds.south);
      const west = Math.max(bounds.getSouthWest().lng(), congoBounds.west);
      const north = Math.min(bounds.getNorthEast().lat(), congoBounds.north);
      const east = Math.min(bounds.getNorthEast().lng(), congoBounds.east);

      const finalBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(south, west),
        new google.maps.LatLng(north, east),
      );

      map.fitBounds(finalBounds);
    }
  }, [map, displayPoints, restrictToCongo, congoBounds]);

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Erreur de chargement de Google Maps</p>
        <p className="text-sm text-red-500 mt-1">Vérifiez votre clé API</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Chargement de la carte du Congo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* En-tête Congo */}
      <div className="mb-6 p-6 bg-gradient-to-r from-green-800 via-yellow-600 to-red-600 rounded-xl shadow-lg text-white">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">République du Congo</h1>
            <p className="text-lg opacity-90">
              Carte des villes et routes principales
            </p>
            <div className="flex items-center mt-2">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Capitale</span>
              <div className="w-4 h-4 rounded-full bg-green-500 mx-4 mr-2"></div>
              <span className="text-sm">Ports/Villes</span>
              <div className="w-4 h-4 rounded-full bg-yellow-500 mx-4 mr-2"></div>
              <span className="text-sm">Zones agricoles</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <div className="text-2xl font-bold">
              {displayPoints.length} Villes
            </div>
            <div className="text-lg">{displaySegments.length} Routes</div>
            <div className="text-sm opacity-80 mt-1">Surface: 342,000 km²</div>
          </div>
        </div>
      </div>

      {/* Carte Google Maps */}
      <div className="hidden rounded-xl overflow-hidden shadow-2xl border-2 border-gray-300">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: true,
            mapTypeId: "terrain", // Type de carte terrain pour mieux voir le relief
            minZoom: restrictToCongo ? 5 : 1,
            maxZoom: 15,
            styles: [
              {
                featureType: "administrative.country",
                elementType: "geometry.stroke",
                stylers: [{ color: "#000000" }, { weight: 2 }],
              },
              {
                featureType: "administrative.province",
                elementType: "geometry.stroke",
                stylers: [{ color: "#4A5568" }, { weight: 1 }],
              },
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#3182CE" }],
              },
            ],
          }}
        >
          {/* Afficher les segments de route */}
          {displaySegments.map((segment, index) => (
            <Polyline
              key={`route-${index}`}
              path={[segment.from, segment.to]}
              options={{
                strokeColor: segment.color,
                strokeOpacity: 0.8,
                strokeWeight: segment.width,
                geodesic: true,
                zIndex: 1,
              }}
            />
          ))}

          {/* Afficher les marqueurs */}
          {displayPoints.map((point, index) => (
            <Marker
              key={`marker-${index}`}
              position={point}
              onClick={() => handleMarkerClick(point)}
              label={{
                text: point.icon || "📍",
                fontSize: "20px",
                fontWeight: "bold",
              }}
              icon={createCustomIcon(point)}
              animation={
                point.type === "capital"
                  ? google.maps.Animation.BOUNCE
                  : undefined
              }
            />
          ))}

          {/* InfoWindow pour le point sélectionné */}
          {selectedPoint && (
            <InfoWindow
              position={selectedPoint}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-3 max-w-xs bg-white rounded-lg shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {selectedPoint.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedPoint.description}
                    </p>
                  </div>
                  <span className="text-2xl ml-2">{selectedPoint.icon}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Température:</span>
                      <div className="font-medium text-red-600">
                        {selectedPoint.temperature} K
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Note:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-medium">
                          {selectedPoint.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedPoint.type && (
                    <div className="mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 inline-block">
                      Type: {selectedPoint.type}
                    </div>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Légende des routes */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow border">
        <h3 className="font-bold text-gray-800 mb-3">
          Routes principales du Congo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {displaySegments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center p-3 hover:bg-gray-50 rounded border"
            >
              <div
                className="w-8 h-1 mr-3"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="flex-1">
                <div className="font-medium">{segment.label}</div>
                <div className="text-sm text-gray-500">
                  {segment.from.title} → {segment.to.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
