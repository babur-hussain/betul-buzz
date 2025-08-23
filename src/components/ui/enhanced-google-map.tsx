import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Business {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  rating: number;
  total_reviews: number;
  location: { lat: number; lng: number };
  is_verified: boolean;
  is_featured: boolean;
  is_premium: boolean;
  status: string;
}

interface EnhancedGoogleMapProps {
  businesses: Business[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onBusinessClick?: (business: Business) => void;
  onMapClick?: (location: { lat: number; lng: number }) => void;
  className?: string;
  height?: string;
  showBusinesses?: boolean;
  clustering?: boolean;
  customControls?: boolean;
}

const EnhancedGoogleMap: React.FC<EnhancedGoogleMapProps> = ({
  businesses = [],
  center = { lat: 23.1765, lng: 77.5885 }, // Betul, MP default
  zoom = 13,
  onBusinessClick,
  onMapClick,
  className = "",
  height = "500px",
  showBusinesses = true,
  clustering = true,
  customControls = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const clustererRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showTransit, setShowTransit] = useState(false);
  const [showBicycling, setShowBicycling] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: 'AIzaSyDggmqBtGRr7QgniVlGsZv7cISpiJKsqxg',
          version: 'weekly',
          libraries: ['places', 'geometry', 'visualization']
        });

        await loader.load();
        
        if (mapRef.current) {
          // Create map instance
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            mapTypeId: mapType,
            styles: getCustomMapStyles(),
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            gestureHandling: 'cooperative',
            backgroundColor: '#f8fafc'
          });

          mapInstanceRef.current = map;

          // Create info window
          infoWindowRef.current = new google.maps.InfoWindow();

          // Add custom controls
          if (customControls) {
            addCustomControls(map);
          }

          // Add map click listener
          map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng && onMapClick) {
              onMapClick({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              });
            }
          });

          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Update map when businesses change
  useEffect(() => {
    if (isLoaded && mapInstanceRef.current && showBusinesses) {
      updateBusinessMarkers();
    }
  }, [businesses, isLoaded, showBusinesses]);

  // Update map when center or zoom changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Update map type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // Update traffic layer
  useEffect(() => {
    if (mapInstanceRef.current) {
      const trafficLayer = new google.maps.TrafficLayer();
      if (showTraffic) {
        trafficLayer.setMap(mapInstanceRef.current);
      } else {
        trafficLayer.setMap(null);
      }
    }
  }, [showTraffic]);

  // Update transit layer
  useEffect(() => {
    if (mapInstanceRef.current) {
      const transitLayer = new google.maps.TransitLayer();
      if (showTransit) {
        transitLayer.setMap(mapInstanceRef.current);
      } else {
        transitLayer.setMap(null);
      }
    }
  }, [showTransit]);

  // Update bicycling layer
  useEffect(() => {
    if (mapInstanceRef.current) {
      const bicyclingLayer = new google.maps.BicyclingLayer();
      if (showBicycling) {
        bicyclingLayer.setMap(mapInstanceRef.current);
      } else {
        bicyclingLayer.setMap(null);
      }
    }
  }, [showBicycling]);

  const addCustomControls = (map: google.maps.Map) => {
    // Zoom controls
    const zoomControl = document.createElement('div');
    zoomControl.className = 'custom-map-controls';
    zoomControl.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button id="zoom-in" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>
        <button id="zoom-out" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
          </svg>
        </button>
      </div>
    `;

    // Map type controls
    const mapTypeControl = document.createElement('div');
    mapTypeControl.className = 'custom-map-controls';
    mapTypeControl.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button id="map-roadmap" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center text-xs font-medium">R</button>
        <button id="map-satellite" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center text-xs font-medium">S</button>
        <button id="map-hybrid" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center text-xs font-medium">H</button>
        <button id="map-terrain" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center text-xs font-medium">T</button>
      </div>
    `;

    // Layer controls
    const layerControl = document.createElement('div');
    layerControl.className = 'custom-map-controls';
    layerControl.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button id="toggle-traffic" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center text-xs font-medium ${showTraffic ? 'bg-blue-100 text-blue-600' : ''}">T</button>
        <button id="toggle-transit" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center text-xs font-medium ${showTransit ? 'bg-blue-100 text-blue-600' : ''}">B</button>
        <button id="toggle-bicycling" class="w-8 h-8 bg-white hover:bg-gray-50 rounded border flex items-center justify-center text-xs font-medium ${showBicycling ? 'bg-blue-100 text-blue-600' : ''}">C</button>
      </div>
    `;

    // Add controls to map
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(zoomControl);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(mapTypeControl);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(layerControl);

    // Add event listeners
    setTimeout(() => {
      const zoomInBtn = document.getElementById('zoom-in');
      const zoomOutBtn = document.getElementById('zoom-out');
      const mapRoadmapBtn = document.getElementById('map-roadmap');
      const mapSatelliteBtn = document.getElementById('map-satellite');
      const mapHybridBtn = document.getElementById('map-hybrid');
      const mapTerrainBtn = document.getElementById('map-terrain');
      const toggleTrafficBtn = document.getElementById('toggle-traffic');
      const toggleTransitBtn = document.getElementById('toggle-transit');
      const toggleBicyclingBtn = document.getElementById('toggle-bicycling');

      zoomInBtn?.addEventListener('click', () => map.setZoom((map.getZoom() || 13) + 1));
      zoomOutBtn?.addEventListener('click', () => map.setZoom((map.getZoom() || 13) - 1));
      mapRoadmapBtn?.addEventListener('click', () => setMapType('roadmap'));
      mapSatelliteBtn?.addEventListener('click', () => setMapType('satellite'));
      mapHybridBtn?.addEventListener('click', () => setMapType('hybrid'));
      mapTerrainBtn?.addEventListener('click', () => setMapType('terrain'));
      toggleTrafficBtn?.addEventListener('click', () => setShowTraffic(!showTraffic));
      toggleTransitBtn?.addEventListener('click', () => setShowTransit(!showTransit));
      toggleBicyclingBtn?.addEventListener('click', () => setShowBicycling(!showBicycling));
    }, 100);
  };

  const updateBusinessMarkers = useCallback(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    const markers = businesses.map(business => {
      const marker = new google.maps.Marker({
        position: business.location,
        map: mapInstanceRef.current,
        title: business.name,
        icon: getMarkerIcon(business),
        animation: google.maps.Animation.DROP
      });

      // Add click listener
      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          const content = createInfoWindowContent(business);
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
        onBusinessClick?.(business);
      });

      return marker;
    });

    markersRef.current = markers;

    // Add clustering if enabled
    if (clustering && markers.length > 0) {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      
      // Simple clustering implementation
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.getPosition()!));
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [businesses, clustering, onBusinessClick]);

  const getMarkerIcon = (business: Business) => {
    let iconColor = '#3B82F6'; // Default blue
    
    if (business.is_premium) {
      iconColor = '#F59E0B'; // Gold for premium
    } else if (business.is_featured) {
      iconColor = '#8B5CF6'; // Purple for featured
    } else if (business.is_verified) {
      iconColor = '#10B981'; // Green for verified
    }

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: iconColor,
      fillOpacity: 0.8,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8
    };
  };

  const createInfoWindowContent = (business: Business) => {
    return `
      <div class="p-4 max-w-xs">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">${business.name.charAt(0)}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">${business.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${business.category}</p>
            <div class="flex items-center space-x-2 mb-2">
              <div class="flex items-center">
                <span class="text-yellow-400">⭐</span>
                <span class="text-sm font-medium text-gray-700 ml-1">${business.rating.toFixed(1)}</span>
                <span class="text-xs text-gray-500 ml-1">(${business.total_reviews})</span>
              </div>
            </div>
            <p class="text-sm text-gray-600">${business.address}, ${business.city}</p>
            <div class="flex items-center space-x-2 mt-2">
              ${business.is_verified ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Verified</span>' : ''}
              ${business.is_featured ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">⭐ Featured</span>' : ''}
              ${business.is_premium ? '<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">👑 Premium</span>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const getCustomMapStyles = () => {
    return [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#7c93a3' }, { lightness: -10 }]
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ visibility: 'simplified' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#aee2e0' }]
      }
    ];
  };

  const handleMapTypeChange = (newMapType: typeof mapType) => {
    setMapType(newMapType);
  };

  const handleLayerToggle = (layer: 'traffic' | 'transit' | 'bicycling') => {
    switch (layer) {
      case 'traffic':
        setShowTraffic(!showTraffic);
        break;
      case 'transit':
        setShowTransit(!showTransit);
        break;
      case 'bicycling':
        setShowBicycling(!showBicycling);
        break;
    }
  };

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full rounded-lg shadow-lg"
        style={{ height }}
      />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <div className="font-medium mb-2">Business Types</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Regular</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Featured</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Premium</span>
          </div>
        </div>
      </div>

      {/* Business Count */}
      {showBusinesses && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2">
          <div className="text-sm font-medium text-gray-700">
            {businesses.length} businesses
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedGoogleMap;
