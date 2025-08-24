import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Building, 
  Clock, 
  Phone, 
  Mail, 
  Globe,
  Navigation,
  Heart,
  Share2,
  Bookmark,
  Eye,
  TrendingUp,
  Award,
  Shield,
  Crown,
  RefreshCw
} from 'lucide-react';
import PlacesAutocomplete from '../ui/places-autocomplete';
import EnhancedGoogleMap from '../ui/enhanced-google-map';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { UserPreferencesService } from '../../services/userPreferencesService';
import { SavedBusiness, FavoriteBusiness } from '../../types/userPreferences';

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  services: string[];
  tags: string[];
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_featured: boolean;
  is_premium: boolean;
  status: string;
  location: { lat: number; lng: number };
  business_hours: any;
  created_at: string;
  updated_at: string;
  imageUrl: string;
}

interface BusinessWithDistance extends Business {
  distance: number;
}

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  rating: number;
  distance: number;
  verified: boolean;
  featured: boolean;
  premium: boolean;
  openNow: boolean;
  services: string[];
  priceRange: string;
}

// Get category-based fallback images
const getCategoryImage = (category: string): string => {
  const categoryImages: { [key: string]: string } = {
    'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'food': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
    'hospital': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
    'health': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
    'clinic': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
    'auto_service': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    'car_repair': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    'car_dealer': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    'beauty_salon': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    'spa': 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    'electronics_store': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    'store': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    'shopping_mall': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    'pharmacy': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    'bank': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    'school': 'https://images.unsplash.com/photo-1523050854058-8df90110c9c1?w=400&h=300&fit=crop',
    'university': 'https://images.unsplash.com/photo-1523050854058-8df90110c9c1?w=400&h=300&fit=crop',
    'gym': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    'hotel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'lodging': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'gas_station': 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    'parking': 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    'bus_station': 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    'train_station': 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    'airport': 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    'police': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'fire_station': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'post_office': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    'library': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'museum': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    'movie_theater': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    'amusement_park': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    'zoo': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    'park': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    'business': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
  };

  // Try to find exact match first
  if (categoryImages[category]) {
    return categoryImages[category];
  }

  // Try to find partial match
  const partialMatch = Object.keys(categoryImages).find(key => 
    category.toLowerCase().includes(key.toLowerCase()) || 
    key.toLowerCase().includes(category.toLowerCase())
  );

  if (partialMatch) {
    return categoryImages[partialMatch];
  }

  // Default business image
  return categoryImages['business'];
};

const BusinessSearch: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [heroSearchResults, setHeroSearchResults] = useState<Business[]>([]);
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>('');
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    location: '',
    rating: 0,
    distance: 50,
    verified: false,
    featured: false,
    premium: false,
    openNow: false,
    services: [],
    priceRange: 'all'
  });
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'name' | 'newest'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'completed'>('idle');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  
  // User preferences state
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<FavoriteBusiness[]>([]);
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  
  // Get auth context
  const authContext = useAuth();
  const user = authContext?.user;
  const isAuthenticated = authContext?.isAuthenticated;

  // Business categories - will be populated from Google Places API
  const [businessCategories, setBusinessCategories] = useState<string[]>(['All Categories']);

  // Services - will be populated from Google Places API
  const [availableServices, setAvailableServices] = useState<string[]>([]);

  // Price ranges - simplified for now
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Budget Friendly' },
    { value: 'high', label: 'Premium' }
  ];

  // Fetch businesses
  useEffect(() => {
    fetchBusinesses();
  }, []);
  
  // Listen for HeroSection search results
  useEffect(() => {
    const checkHeroSearchResults = () => {
      const storedResults = localStorage.getItem('heroSearchResults');
      const storedQuery = localStorage.getItem('heroSearchQuery');
      
      if (storedResults && storedQuery) {
        try {
          const results = JSON.parse(storedResults);
          console.log('🏢 HeroSection search results received:', results.length, 'businesses');
          setHeroSearchResults(results);
          setHeroSearchQuery(storedQuery);
          
          // Update the main businesses state with HeroSection results
          setBusinesses(results);
          setFilteredBusinesses(results);
          
          // Also update search filters to show the query
          setSearchFilters(prev => ({ ...prev, query: storedQuery }));
          
          // Clear the stored results to avoid conflicts
          localStorage.removeItem('heroSearchResults');
          localStorage.removeItem('heroSearchQuery');
        } catch (error) {
          console.error('Error parsing HeroSection results:', error);
        }
      }
    };
    
    // Check immediately
    checkHeroSearchResults();
    
    // Set up interval to check for new results
    const interval = setInterval(checkHeroSearchResults, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Load user preferences when authenticated
  useEffect(() => {
    if (isAuthenticated && user && !userPreferencesLoaded && authContext) {
      loadUserPreferences();
    }
  }, [isAuthenticated, user, userPreferencesLoaded, authContext]);

  // Separate useEffect for location detection - only after user interaction
  useEffect(() => {
    console.log('📍 useEffect triggered, businesses count:', businesses.length);
    if (businesses.length > 0) {
      console.log('📍 Setting default location and showing all businesses');
      // Don't auto-get location - wait for user interaction
      // Set default location for now
      const defaultLocation = {
        lat: 23.1765,
        lng: 77.5885,
        address: 'Betul, MP (Default)'
      };
      setUserLocation(defaultLocation);
      // Show all businesses initially
      setFilteredBusinesses(businesses);
      console.log('📍 Default location set, businesses displayed:', businesses.length);
    }
  }, [businesses]);

  // Filter businesses when filters change
  useEffect(() => {
    filterBusinesses();
  }, [businesses, searchFilters, sortBy]);

  const fetchBusinesses = async () => {
    try {
      console.log('🏢 fetchBusinesses started');
      setIsLoading(true);
      
      // Fetch all active businesses
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      console.log('🏢 Supabase data:', data);
      console.log('🏢 Data length:', data?.length);

      if (data) {
        // Use only database businesses, no mock data
        let businessData = data;
        if (data.length === 0) {
          console.log('🏢 No businesses in DB, will use Google Places API for live search');
          businessData = [];
        } else {
          // Add imageUrl field to database businesses
          businessData = data.map(business => ({
            ...business,
            imageUrl: business.image_url || getCategoryImage(business.category || 'business')
          }));
          console.log('🏢 Added imageUrl to database businesses');
        }
        
        console.log('🏢 Setting businesses state with:', businessData.length, 'businesses');
        setBusinesses(businessData);
        setFilteredBusinesses(businessData);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load user preferences (saved and favorite businesses)
  const loadUserPreferences = async () => {
    if (!user?.id || !authContext) return;
    
    try {
      console.log('🔍 Loading user preferences for:', user.id);
      
      // Load saved businesses
      const saved = await UserPreferencesService.getSavedBusinesses(user.id);
      setSavedBusinesses(saved);
      
      // Load favorite businesses
      const favorites = await UserPreferencesService.getFavoriteBusinesses(user.id);
      setFavoriteBusinesses(favorites);
      
      setUserPreferencesLoaded(true);
      console.log('✅ User preferences loaded:', { saved: saved.length, favorites: favorites.length });
    } catch (error) {
      console.error('❌ Error loading user preferences:', error);
    }
  };
  
  // Handle saving a business
  const handleSaveBusiness = async (business: Business) => {
    if (!isAuthenticated || !user?.id || !authContext) {
      alert('Please log in to save businesses');
      return;
    }
    
    try {
      const success = await UserPreferencesService.saveBusiness(user.id, business);
      if (success) {
        // Reload preferences to get updated state
        await loadUserPreferences();
        alert('Business saved successfully!');
      } else {
        alert('Failed to save business');
      }
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Error saving business');
    }
  };
  
  // Handle favoriting a business
  const handleFavoriteBusiness = async (business: Business) => {
    if (!isAuthenticated || !user?.id || !authContext) {
      alert('Please log in to favorite businesses');
      return;
    }
    
    try {
      const success = await UserPreferencesService.toggleFavoriteBusiness(user.id, business);
      if (success) {
        // Reload preferences to get updated state
        await loadUserPreferences();
        alert('Business favorited successfully!');
      } else {
        alert('Failed to favorite business');
      }
    } catch (error) {
      console.error('Error favoriting business:', error);
      alert('Error favoriting business');
    }
  };
  
  // Check if a business is saved by current user
  const isBusinessSaved = (businessId: string): boolean => {
    return savedBusinesses.some(saved => saved.business_id === businessId);
  };
  
  // Check if a business is favorited by current user
  const isBusinessFavorited = (businessId: string): boolean => {
    return favoriteBusinesses.some(favorite => favorite.business_id === businessId);
  };

  const filterBusinesses = useCallback(() => {
    let filtered = [...businesses];

    // Text search - improved logic
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase().trim();
      
      // Split query into words for better matching
      const queryWords = query.split(' ').filter(word => word.length > 0);
      
      filtered = filtered.filter(business => {
        const businessText = [
          business.name.toLowerCase(),
          business.description.toLowerCase(),
          business.category.toLowerCase(),
          ...business.services.map(s => s.toLowerCase()),
          ...business.tags.map(t => t.toLowerCase()),
          business.address.toLowerCase(),
          business.city.toLowerCase()
        ].join(' ');
        
        // Check if all query words are found in business text
        return queryWords.every(word => businessText.includes(word));
      });
    }

    // Category filter
    if (searchFilters.category !== 'all') {
      filtered = filtered.filter(business => business.category === searchFilters.category);
    }

    // Rating filter
    if (searchFilters.rating > 0) {
      filtered = filtered.filter(business => business.rating >= searchFilters.rating);
    }

    // Verification filters
    if (searchFilters.verified) {
      filtered = filtered.filter(business => business.is_verified);
    }
    if (searchFilters.featured) {
      filtered = filtered.filter(business => business.is_featured);
    }
    if (searchFilters.premium) {
      filtered = filtered.filter(business => business.is_premium);
    }

    // Services filter
    if (searchFilters.services.length > 0) {
      filtered = filtered.filter(business =>
        searchFilters.services.some(service => 
          business.services.includes(service)
        )
      );
    }

            // Sort results
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'distance':
              // If location is selected, sort by distance
              if (searchFilters.location && a.distance !== undefined && b.distance !== undefined) {
                return a.distance - b.distance;
              }
              return 0;
            case 'name':
              return a.name.localeCompare(b.name);
            case 'newest':
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            default:
              return 0;
          }
        });

    setFilteredBusinesses(filtered);
  }, [businesses, searchFilters, sortBy]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const selectedLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || place.name || ''
      };
      
      setSearchFilters(prev => ({
        ...prev,
        location: selectedLocation.address
      }));
      
      // Filter businesses by distance from selected location
      filterBusinessesByLocation(selectedLocation);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Get user's current location automatically
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Your Current Location'
          };
          setUserLocation(location);
          // Automatically search for nearby businesses
          searchNearbyBusinesses('');
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (Betul, MP)
          const defaultLocation = {
            lat: 23.1765,
            lng: 77.5885,
            address: 'Betul, MP (Default)'
          };
          setUserLocation(defaultLocation);
          searchNearbyBusinesses('');
        }
      );
    } else {
      // Fallback to default location
      const defaultLocation = {
        lat: 23.1765,
        lng: 77.5885,
        address: 'Betul, MP (Default)'
      };
      setUserLocation(defaultLocation);
      searchNearbyBusinesses('');
    }
  }, []);

  // Smart search that automatically finds businesses near user
    const searchNearbyBusinesses = useCallback(async (query: string) => {
    console.log('🔍 searchNearbyBusinesses called with query:', query);
    console.log('📍 userLocation:', userLocation);
    console.log('🏢 businesses count:', businesses.length);

    // Ensure we have a location (use default if none)
    const currentLocation = userLocation || {
      lat: 23.1765,
      lng: 77.5885,
      address: 'Betul, MP (Default)'
    };

    let filtered = [...businesses];
    console.log('🔍 Initial businesses:', filtered.length);

    // Text search if query provided
    if (query.trim()) {
      const queryWords = query.toLowerCase().trim().split(' ').filter(word => word.length > 0);
      console.log('🔍 Search query words:', queryWords);

      filtered = filtered.filter(business => {
        const businessText = [
          business.name.toLowerCase(),
          business.description.toLowerCase(),
          business.category.toLowerCase(),
          ...business.services.map(s => s.toLowerCase()),
          ...business.tags.map(t => t.toLowerCase()),
          business.address.toLowerCase(),
          business.city.toLowerCase()
        ].join(' ');

        const matches = queryWords.every(word => businessText.includes(word));
        console.log(`🔍 Business "${business.name}" matches "${query}":`, matches);
        return matches;
      });

      console.log('🔍 After text filtering:', filtered.length);
    }

    // If no local results, try Google Places API
    if (filtered.length === 0 && query.trim()) {
      console.log('🔍 No local results, searching Google Places API...');
      try {
        const googleResults = await searchGooglePlaces(query, currentLocation);
        if (googleResults.length > 0) {
          console.log('🔍 Google Places results:', googleResults.length);
          setFilteredBusinesses(googleResults);
          setSearchStatus('completed');
          return;
        }
      } catch (error) {
        console.error('🔍 Google Places API error:', error);
      }
    }

    // Show results (either local or empty)
    console.log('🔍 Final filtered businesses:', filtered.length);
    console.log('🔍 Final results:', filtered.map(b => b.name));

    setFilteredBusinesses(filtered);
    setSearchStatus('completed');
  }, [businesses, userLocation, searchFilters.distance]);

  // Search Google Places API for real business results
  const searchGooglePlaces = async (query: string, location: { lat: number; lng: number; address: string }) => {
    console.log('🔍 Searching Google Places for:', query, 'near:', location);
    
    try {
      // Check if Google Maps API is loaded
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.log('🔍 Google Maps API not loaded, loading script...');
        await loadGoogleMapsScript();
      }

      // Create a PlacesService instance
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      // Search for places - use nearbySearch for better photo access
      const searchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: searchFilters.distance * 1000, // Convert km to meters
        keyword: query,
        type: 'establishment'
      };

      return new Promise<Business[]>((resolve, reject) => {
        // Use nearbySearch for better photo access, then get details for each place
        service.nearbySearch(searchRequest, async (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            console.log('🔍 Google Places nearbySearch results:', results);
            
            // Get detailed information for each place to access photos
            const detailedBusinesses = await Promise.all(
              results.map(async (place, index) => {
                try {
                  // Get place details to access photos
                  const detailsRequest = {
                    placeId: place.place_id,
                    fields: ['name', 'formatted_address', 'geometry', 'types', 'rating', 'user_ratings_total', 'formatted_phone_number', 'website', 'photos']
                  };
                  
                  return new Promise<Business>((resolveDetail) => {
                    service.getDetails(detailsRequest, (placeDetails, detailsStatus) => {
                      if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                        console.log('🔍 Place details for:', placeDetails.name, 'Photos:', placeDetails.photos);
                        
                        // Get real image from Google Places or use category-based fallback
                        let imageUrl = '';
                        console.log('🔍 Checking photos for:', placeDetails.name);
                        console.log('🔍 Photos array:', placeDetails.photos);
                        console.log('🔍 Photos length:', placeDetails.photos?.length);
                        
                        if (placeDetails.photos && placeDetails.photos.length > 0) {
                          // Use Google Places photo
                          const photo = placeDetails.photos[0];
                          console.log('🔍 Photo object:', photo);
                          console.log('🔍 Photo reference:', photo.photo_reference);
                          
                          // Try different URL formats for Google Places photos
                          const photoUrl1 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=300&photo_reference=${photo.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
                          const photoUrl2 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
                          
                          console.log('📸 Photo URL 1:', photoUrl1);
                          console.log('📸 Photo URL 2:', photoUrl2);
                          
                          // Use the first URL format
                          imageUrl = photoUrl1;
                          console.log('📸 Using Google Places photo for:', placeDetails.name, 'URL:', imageUrl);
                        } else {
                          // Use category-based fallback images
                          const category = placeDetails.types?.[0] || 'business';
                          imageUrl = getCategoryImage(category);
                          console.log('🖼️ Using fallback image for:', placeDetails.name, 'Category:', category, 'Fallback URL:', imageUrl);
                          
                          // Test if the fallback image URL is valid
                          const testImg = new Image();
                          testImg.onload = () => console.log('✅ Fallback image test successful for:', placeDetails.name);
                          testImg.onerror = () => console.log('❌ Fallback image test failed for:', placeDetails.name);
                          testImg.src = imageUrl;
                        }

                        const business: Business = {
                          id: `google_${placeDetails.place_id || index}`,
                          name: placeDetails.name || 'Unknown Business',
                          description: placeDetails.formatted_address || '',
                          category: placeDetails.types?.[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Business',
                          address: placeDetails.formatted_address || '',
                          city: place.vicinity || location.address,
                          state: location.address.split(', ')[1] || 'Madhya Pradesh',
                          pincode: '460001',
                          phone: placeDetails.formatted_phone_number || '+91-XXXXXXXXXX',
                          email: 'info@business.com',
                          website: placeDetails.website || '',
                          services: placeDetails.types?.map(t => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) || [],
                          tags: placeDetails.types?.map(t => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) || [],
                          rating: placeDetails.rating || 0,
                          total_reviews: placeDetails.user_ratings_total || 0,
                          is_verified: true,
                          is_featured: false,
                          is_premium: false,
                          status: 'active',
                          location: {
                            lat: placeDetails.geometry?.location?.lat() || location.lat,
                            lng: placeDetails.geometry?.location?.lng() || location.lng
                          },
                          business_hours: {},
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                          imageUrl: imageUrl
                        };
                        
                        resolveDetail(business);
                      } else {
                        // Fallback to basic place info if details fail
                        console.log('🔍 Place details failed for:', place.name, 'Status:', detailsStatus);
                        
                        const category = place.types?.[0] || 'business';
                        const imageUrl = getCategoryImage(category);
                        console.log('🖼️ Fallback image for failed details:', place.name, 'Category:', category, 'URL:', imageUrl);
                        
                        const business: Business = {
                          id: `google_${place.place_id || index}`,
                          name: place.name || 'Unknown Business',
                          description: place.formatted_address || '',
                          category: place.types?.[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Business',
                          address: place.formatted_address || '',
                          city: place.vicinity || location.address,
                          state: location.address.split(', ')[1] || 'Madhya Pradesh',
                          pincode: '460001',
                          phone: place.formatted_phone_number || '+91-XXXXXXXXXX',
                          email: 'info@business.com',
                          website: place.website || '',
                          services: place.types?.map(t => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) || [],
                          tags: place.types?.map(t => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) || [],
                          rating: place.rating || 0,
                          total_reviews: place.user_ratings_total || 0,
                          is_verified: true,
                          is_featured: false,
                          is_premium: false,
                          status: 'active',
                          location: {
                            lat: place.geometry?.location?.lat() || location.lat,
                            lng: place.geometry?.location?.lng() || location.lng
                          },
                          business_hours: {},
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                          imageUrl: imageUrl
                        };
                        
                        resolveDetail(business);
                      }
                    });
                  });
                } catch (error) {
                  console.error('🔍 Error getting place details:', error);
                  // Return basic business info with fallback image
                  const category = place.types?.[0] || 'business';
                  const imageUrl = getCategoryImage(category);
                  
                  const business: Business = {
                    id: `google_${place.place_id || index}`,
                    name: place.name || 'Unknown Business',
                    description: place.formatted_address || '',
                    category: place.types?.[0]?.replace(/\b\w/g, l => l.toUpperCase()) || 'Business',
                    address: place.formatted_address || '',
                    city: place.vicinity || location.address,
                    state: location.address.split(', ')[1] || 'Madhya Pradesh',
                    pincode: '460001',
                    phone: place.formatted_phone_number || '+91-XXXXXXXXXX',
                    email: 'info@business.com',
                    website: place.website || '',
                    services: place.types?.map(t => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) || [],
                    tags: place.types?.map(t => t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) || [],
                    rating: place.rating || 0,
                    total_reviews: place.user_ratings_total || 0,
                    is_verified: true,
                    is_featured: false,
                    is_premium: false,
                    status: 'active',
                    location: {
                      lat: place.geometry?.location?.lat() || location.lat,
                      lng: place.geometry?.location?.lng() || location.lng
                    },
                    business_hours: {},
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    imageUrl: imageUrl
                  };
                  
                  return business;
                }
              })
            );
            
            console.log('🔍 Detailed businesses with images:', detailedBusinesses);
            resolve(detailedBusinesses);
          } else {
            console.log('🔍 Google Places search failed:', status);
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('🔍 Error searching Google Places:', error);
      return [];
    }
  };

  // Load Google Maps script if not already loaded
  const loadGoogleMapsScript = async () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

                    const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      console.log('🔑 Google Maps API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('🔍 Google Maps script loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        console.error('🔍 Failed to load Google Maps script');
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });
  };

  // Filter businesses by location and distance
  const filterBusinessesByLocation = (selectedLocation: { lat: number; lng: number; address: string }) => {
    const businessesWithDistance = businesses.map(business => ({
      ...business,
      distance: calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        business.location.lat,
        business.location.lng
      )
    }));

    // Sort by distance and filter by max distance
    const nearbyBusinesses = businessesWithDistance
      .filter(business => business.distance <= searchFilters.distance)
      .sort((a, b) => a.distance - b.distance);

    setFilteredBusinesses(nearbyBusinesses);
  };

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleMapClick = (location: { lat: number; lng: number }) => {
    // TODO: Handle map click for location selection
    console.log('Map clicked at:', location);
  };

  const resetFilters = () => {
    setSearchFilters({
      query: '',
      category: 'all',
      location: '',
      rating: 0,
      distance: 50,
      verified: false,
      featured: false,
      premium: false,
      openNow: false,
      services: [],
      priceRange: 'all'
    });
  };

  const getBusinessStatusBadges = (business: Business) => {
    const badges = [];
    
    if (business.is_verified) {
      badges.push(
        <Badge key="verified" variant="secondary" className="bg-green-100 text-green-800">
          <Shield className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    }
    
    if (business.is_featured) {
      badges.push(
        <Badge key="featured" variant="secondary" className="bg-purple-100 text-purple-800">
          <Award className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      );
    }
    
    if (business.is_premium) {
      badges.push(
        <Badge key="premium" variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      );
    }
    
    return badges;
  };

  // Don't render if auth context is not ready
  if (!authContext) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="business-search-section" className="space-y-6">
      {/* Search Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {heroSearchQuery ? `Search Results for "${heroSearchQuery}"` : 'Find the Perfect Business'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {heroSearchQuery 
              ? `Found ${heroSearchResults.length} businesses from your search. Use the filters below to refine results.`
              : 'Discover verified businesses in Betul and surrounding areas. Live Google Places API search for real-time results.'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            {/* Simple Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-white rounded-full border-2 border-purple-300 hover:border-purple-400 focus-within:border-purple-500 transition-all duration-200 shadow-sm">
                {/* Search Icon */}
                <div className="pl-4 pr-3">
                  <Search className="w-5 h-5 text-purple-500" />
                </div>
                
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search for businesses, services, or anything you need..."
                  value={searchFilters.query}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('🔍 Input changed to:', value);
                    setSearchFilters(prev => ({ ...prev, query: value }));
                    
                    // Real-time search as user types
                    if (value.trim()) {
                      console.log('🔍 Triggering search for:', value);
                      setTimeout(() => {
                        searchNearbyBusinesses(value);
                      }, 300);
                    } else {
                      // Show nearby businesses if search is empty
                      console.log('🔍 Clearing search, showing all nearby');
                      searchNearbyBusinesses('');
                    }
                  }}
                  className="flex-1 py-3 pr-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none border-none bg-transparent"
                />
                
                {/* Right Side Icons */}
                <div className="flex items-center space-x-2 pr-4">
                  {/* Clear Button */}
                  {searchFilters.query && (
                    <button
                      onClick={() => {
                        setSearchFilters(prev => ({ ...prev, query: '' }));
                        searchNearbyBusinesses('');
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Location Icon - Click to open popup */}
                  <button
                    onClick={() => setShowLocationPopup(true)}
                    className="p-1 text-purple-500 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50"
                    title="Select location"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                  
                  {/* Filter Icon */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-1 transition-colors rounded-full hover:bg-gray-100 ${
                      showFilters ? 'text-purple-600 bg-purple-50' : 'text-purple-500 hover:text-purple-600'
                    }`}
                    title="Show filters"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
                </div>
                
                {/* Current Location Display */}
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-600">
                    {userLocation ? `📍 ${userLocation.address}` : '📍 Betul, MP'}
                  </span>
                </div>
                
                {/* Location Popup */}
                {showLocationPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Select Location</h3>
                      <button
                        onClick={() => setShowLocationPopup(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Current Location Button */}
                      <button
                        onClick={() => {
                          getUserLocation();
                          setShowLocationPopup(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Use Current Location</div>
                          <div className="text-sm text-gray-500">Get businesses near you</div>
                        </div>
                      </button>
                      
                      {/* Manual Location Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Or enter location manually
                        </label>
                        <PlacesAutocomplete
                          onPlaceSelect={(place) => {
                            if (place.geometry?.location) {
                              const newLocation = {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng(),
                                address: place.formatted_address || place.name || 'Selected Location'
                              };
                              setUserLocation(newLocation);
                              setShowLocationPopup(false);
                              // Search businesses in the new location
                              searchNearbyBusinesses(searchFilters.query);
                            }
                          }}
                          placeholder="Enter city, area, or address..."
                          className="w-full"
                        />
                      </div>
                      
                      {/* Popular Locations */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Popular locations
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Betul, MP', 'Housing Board Colony', 'Ganj, Betul', 'MP Nagar'].map((location) => (
                            <button
                              key={location}
                              onClick={() => {
                                // Set default coordinates for popular locations
                                const defaultCoords = {
                                  'Betul, MP': { lat: 23.1765, lng: 77.5885 },
                                  'Housing Board Colony': { lat: 23.1765, lng: 77.5885 },
                                  'Ganj, Betul': { lat: 23.1765, lng: 77.5885 },
                                  'MP Nagar': { lat: 23.1765, lng: 77.5885 }
                                };
                                
                                const coords = defaultCoords[location as keyof typeof defaultCoords];
                                if (coords) {
                                  setUserLocation({
                                    ...coords,
                                    address: location
                                  });
                                  setShowLocationPopup(false);
                                  searchNearbyBusinesses(searchFilters.query);
                                }
                              }}
                              className="p-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                            >
                              {location}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Google Places API Info */}
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">
                  🔍 <span className="font-medium">Live Search:</span> Powered by Google Places API for real-time business results
                </p>
              </div>
              
              {/* Location Info & Quick Actions */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>
                      {userLocation?.address.includes('Current') 
                        ? `Within ${searchFilters.distance}km of your location` 
                        : `Within ${searchFilters.distance}km of ${userLocation?.address || 'Betul, MP'}`
                      }
                    </span>
                  </div>
                  
                  {userLocation && (
                    <Button
                      onClick={() => searchNearbyBusinesses('')}
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 text-xs bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-xs bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Filters
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setFilteredBusinesses(businesses);
                      setSearchStatus('completed');
                    }}
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-xs bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-blue-300"
                  >
                    <Building className="w-4 h-4 mr-1" />
                    Show All
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {businessCategories.slice(1, 7).map((category) => (
                <Badge
                  key={category}
                  variant={searchFilters.category === category ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setSearchFilters(prev => ({ ...prev, category }))}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Advanced Filters</span>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={searchFilters.category} 
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Minimum Rating: {searchFilters.rating}+</Label>
                <Slider
                  value={[searchFilters.rating]}
                  onValueChange={([value]) => setSearchFilters(prev => ({ ...prev, rating: value }))}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Distance */}
              <div className="space-y-2">
                <Label>Distance: {searchFilters.distance} km</Label>
                <Slider
                  value={[searchFilters.distance]}
                  onValueChange={([value]) => setSearchFilters(prev => ({ ...prev, distance: value }))}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price Range</Label>
                <Select 
                  value={searchFilters.priceRange} 
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, priceRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={searchFilters.verified}
                  onCheckedChange={(checked) => setSearchFilters(prev => ({ ...prev, verified: checked as boolean }))}
                />
                <Label htmlFor="verified">Verified Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={searchFilters.featured}
                  onCheckedChange={(checked) => setSearchFilters(prev => ({ ...prev, featured: checked as boolean }))}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="premium"
                  checked={searchFilters.premium}
                  onCheckedChange={(checked) => setSearchFilters(prev => ({ ...prev, premium: checked as boolean }))}
                />
                <Label htmlFor="premium">Premium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="openNow"
                  checked={searchFilters.openNow}
                  onCheckedChange={(checked) => setSearchFilters(prev => ({ ...prev, openNow: checked as boolean }))}
                />
                <Label htmlFor="openNow">Open Now</Label>
              </div>
            </div>

            {/* Services */}
            <div className="mt-6">
              <Label>Services</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {availableServices.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={searchFilters.services.includes(service)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSearchFilters(prev => ({ 
                            ...prev, 
                            services: [...prev.services, service] 
                          }));
                        } else {
                          setSearchFilters(prev => ({ 
                            ...prev, 
                            services: prev.services.filter(s => s !== service) 
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Header */}
      <div className="mt-8 px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {filteredBusinesses.length} businesses found
              {searchFilters.query && (
                <span className="block sm:inline text-sm font-normal text-blue-600 sm:ml-2 mt-1 sm:mt-0">
                  for "{searchFilters.query}"
                </span>
              )}
              {userLocation && (
                <span className="block sm:inline text-sm font-normal text-green-600 sm:ml-2 mt-1 sm:mt-0">
                  📍 within {searchFilters.distance}km of {userLocation.address.includes('Current') ? 'you' : userLocation.address}
                </span>
              )}
            </h2>
            
            {/* Search Summary */}
            {searchStatus === 'completed' && filteredBusinesses.length > 0 && (
              <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 w-fit">
                ✅ Search completed successfully
              </div>
            )}
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Sort by Rating</SelectItem>
                <SelectItem value="distance">Sort by Distance</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="newest">Sort by Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3 py-2"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3 py-2"
            >
              <Building className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="px-3 py-2"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 sm:px-6 lg:px-8">
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="w-full">
          <TabsContent value="list" className="space-y-4 sm:space-y-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-shrink-0 flex justify-center sm:justify-start">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={business.imageUrl}
                        alt={business.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log('✅ Image loaded successfully for:', business.name, 'URL:', business.imageUrl);
                        }}
                        onError={(e) => {
                          console.error('❌ Image failed to load for:', business.name, 'URL:', business.imageUrl);
                          // Fallback to colored circle if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xl">${business.name.charAt(0)}</span></div>`;
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{business.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                        
                        {/* Rating and Location Info - Mobile Optimized */}
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{business.rating.toFixed(1)}</span>
                            <span className="text-gray-500 ml-1">({business.total_reviews})</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{business.city}, {business.state}</span>
                          </div>
                          {business.distance !== undefined && userLocation && (
                            <div className="flex items-center text-green-600 font-medium text-sm">
                              <Navigation className="w-4 h-4 mr-1" />
                              <span>{business.distance.toFixed(1)} km from {userLocation.address.includes('Current') ? 'you' : userLocation.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-end space-x-2">
                        {getBusinessStatusBadges(business)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3 line-clamp-2">{business.description}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {business.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {business.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{business.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleFavoriteBusiness(business)}
                          className={isBusinessFavorited(business.id) ? 'text-red-500 bg-red-50' : ''}
                          title={isBusinessFavorited(business.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart className={`w-4 h-4 ${isBusinessFavorited(business.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSaveBusiness(business)}
                          className={isBusinessSaved(business.id) ? 'text-yellow-500 bg-yellow-50' : ''}
                          title={isBusinessSaved(business.id) ? 'Remove from saved' : 'Save business'}
                        >
                          <Bookmark className={`w-4 h-4 ${isBusinessSaved(business.id) ? 'fill-current' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            console.log('🔍 Share button clicked for:', business.name);
                            alert(`Sharing: ${business.name}`);
                            try {
                              // Simple share - just copy to clipboard
                              navigator.clipboard.writeText(`${business.name} - ${business.address}`);
                              alert('Business info copied to clipboard!');
                            } catch (error) {
                              console.error('Share failed:', error);
                              alert('Failed to copy to clipboard');
                            }
                          }}
                          title="Share business"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            console.log('🔍 Get Directions button clicked for:', business.name);
                            alert(`Getting directions to: ${business.name}`);
                            try {
                              // Create Google Maps directions URL
                              const destination = `${business.location.lat},${business.location.lng}`;
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                              
                              console.log('🔍 Opening directions URL:', url);
                              window.open(url, '_blank');
                            } catch (error) {
                              console.error('🔍 Error opening directions:', error);
                              alert('Error opening directions');
                            }
                          }}
                          title="Get directions on Google Maps"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-lg overflow-hidden mx-auto mb-4">
                                          <img 
                        src={business.imageUrl}
                        alt={business.name}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log('✅ Grid image loaded successfully for:', business.name, 'URL:', business.imageUrl);
                        }}
                        onError={(e) => {
                          console.error('❌ Grid image failed to load for:', business.name, 'URL:', business.imageUrl);
                          // Fallback to colored circle if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-2xl">${business.name.charAt(0)}</span></div>`;
                          }
                        }}
                      />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{business.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{business.category}</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{business.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({business.total_reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {getBusinessStatusBadges(business)}
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{business.description}</p>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        console.log('🔍 View button clicked for:', business.name);
                        alert(`Viewing details for: ${business.name}`);
                      }}
                      title="View business details"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        console.log('🔍 Directions button clicked for:', business.name);
                        alert(`Getting directions to: ${business.name}`);
                        try {
                          // Create Google Maps directions URL
                          const destination = `${business.location.lat},${business.location.lng}`;
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                          
                          console.log('🔍 Opening directions URL:', url);
                          window.open(url, '_blank');
                        } catch (error) {
                          console.error('🔍 Error opening directions:', error);
                          alert('Error opening directions');
                        }
                      }}
                      title="Get directions on Google Maps"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="map" className="h-64 sm:h-96 lg:h-[600px]">
          <EnhancedGoogleMap
            businesses={filteredBusinesses}
            onBusinessClick={handleBusinessClick}
            onMapClick={handleMapClick}
            height="100%"
            showBusinesses={true}
            clustering={true}
            customControls={true}
          />
        </TabsContent>
      </Tabs>

              {/* No Results */}
        {filteredBusinesses.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <CardContent className="px-4 sm:px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No local businesses found</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                We're searching Google Places API for live results. Try searching for businesses, restaurants, or services in your area.
              </p>
              
              {/* Search Suggestions */}
              <div className="mt-6 text-left max-w-2xl mx-auto">
                <h4 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Search Suggestions:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Try these searches:</p>
                    <ul className="space-y-1">
                      <li>• "restaurant" or "food"</li>
                      <li>• "hospital" or "clinic"</li>
                      <li>• "auto service" or "car repair"</li>
                      <li>• "beauty salon" or "spa"</li>
                      <li>• "electronics store" or "mobile shop"</li>
                    </ul>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Location tips:</p>
                    <ul className="space-y-1">
                      <li>• Enter "Betul, MP" as location</li>
                      <li>• Use "Get My Location" button</li>
                      <li>• Try specific areas like "Housing Board Colony"</li>
                      <li>• Check distance filter (currently: {searchFilters.distance} km)</li>
                      <li>• Live Google Places API search for real-time results</li>
                    </ul>
                  </div>
                </div>
                
                {/* Quick Search Buttons */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('🔍 Test button clicked: restaurant');
                      setSearchFilters(prev => ({ ...prev, query: 'restaurant' }));
                      searchNearbyBusinesses('restaurant');
                    }}
                    className="text-xs px-2 sm:px-3 py-1 w-full sm:w-auto"
                  >
                    Search "restaurant"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('🔍 Test button clicked: cafe');
                      setSearchFilters(prev => ({ ...prev, query: 'cafe' }));
                      searchNearbyBusinesses('cafe');
                    }}
                    className="text-xs px-2 sm:px-3 py-1 w-full sm:w-auto"
                  >
                    Search "cafe"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('🔍 Test button clicked: electronics');
                      setSearchFilters(prev => ({ ...prev, query: 'electronics store' }));
                      searchNearbyBusinesses('electronics store');
                    }}
                    className="text-xs px-2 sm:px-3 py-1 w-full sm:w-auto"
                  >
                    Search "electronics"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('🔍 Debug: Current state');
                      console.log('🔍 businesses:', businesses.length);
                      console.log('🔍 filteredBusinesses:', filteredBusinesses.length);
                      console.log('🔍 userLocation:', userLocation);
                      console.log('🔍 searchFilters:', searchFilters);
                    }}
                    className="text-xs px-2 sm:px-3 py-1 bg-red-100 text-red-700 w-full sm:w-auto"
                  >
                    Debug State
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:space-x-3">
                <Button onClick={resetFilters} variant="outline" className="w-full sm:w-auto">
                  Reset Filters
                </Button>
                <Button 
                  onClick={() => {
                    // Show all businesses
                    setFilteredBusinesses(businesses);
                  }}
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  Show All Businesses
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* User Preferences Section */}
        {isAuthenticated && user && userPreferencesLoaded && (
          <div className="mt-8 space-y-6">
            {/* Saved Businesses */}
            {savedBusinesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-yellow-500" />
                    Saved Businesses ({savedBusinesses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedBusinesses.map((saved) => (
                      <Card key={saved.business_id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{saved.business_name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{saved.business_category}</p>
                          <p className="text-xs text-gray-500 mb-3">{saved.business_address}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Saved: {new Date(saved.saved_at).toLocaleDateString()}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSaveBusiness({ id: saved.business_id } as Business)}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Favorite Businesses */}
            {favoriteBusinesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Favorite Businesses ({favoriteBusinesses.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteBusinesses.map((favorite) => (
                      <Card key={favorite.business_id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{favorite.business_name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{favorite.business_category}</p>
                          <p className="text-xs text-gray-500 mb-3">{favorite.business_address}</p>
                          {favorite.rating && (
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm text-gray-600">{favorite.rating}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Favorited: {new Date(favorite.favorited_at).toLocaleDateString()}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFavoriteBusiness({ id: favorite.business_id } as Business)}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* No Preferences Message */}
            {savedBusinesses.length === 0 && favoriteBusinesses.length === 0 && userPreferencesLoaded && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved or Favorite Businesses</h3>
                  <p className="text-gray-600 mb-4">
                    Start exploring businesses and save your favorites for quick access later.
                  </p>
                  <p className="text-sm text-gray-500">
                    Use the ❤️ and 🔖 buttons on business cards to save and favorite businesses.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessSearch;
