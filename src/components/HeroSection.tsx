import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, TrendingUp, Star, Users, Building, Award, Crown, Filter } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-lenis";
import PlacesAutocomplete from "./ui/places-autocomplete";
import heroBg from "@/assets/hero-bg.jpg";

// Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

const HeroSection = () => {
  const { scrollTo } = useSmoothScroll();
  
  // Search state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    scrollTo(`#${sectionId}`, { offset: -80, duration: 1.5 });
  };

  // Business interface matching BusinessSearch
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

  // Mock search results data
  const mockSearchResults = [
    {
      id: 1,
      name: "Modern Business Center",
      category: "Office Space",
      rating: 4.8,
      reviews: 127,
      location: "Betul, MP",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      price: "₹15,000/month",
      features: ["24/7 Access", "Meeting Rooms", "High-Speed WiFi"],
      verified: true,
      premium: true
    },
    {
      id: 2,
      name: "Tech Startup Hub",
      category: "Co-working Space",
      rating: 4.9,
      reviews: 89,
      location: "Betul, MP",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
      price: "₹12,000/month",
      features: ["Flexible Plans", "Event Space", "Coffee Bar"],
      verified: true,
      premium: false
    },
    {
      id: 3,
      name: "Creative Studio Space",
      category: "Design Studio",
      rating: 4.7,
      reviews: 156,
      location: "Betul, MP",
      image: "https://images.unsplash.com/photo-1497366754035-20039288c0a5?w=400&h=300&fit=crop",
      price: "₹18,000/month",
      features: ["Natural Light", "Equipment Included", "Parking"],
      verified: true,
      premium: true
    },
    {
      id: 4,
      name: "Local Business Plaza",
      category: "Retail Space",
      rating: 4.6,
      reviews: 203,
      location: "Betul, MP",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      price: "₹25,000/month",
      features: ["High Traffic", "Storage Space", "Security"],
      verified: true,
      premium: false
    },
    {
      id: 5,
      name: "Professional Services Center",
      category: "Service Office",
      rating: 4.8,
      reviews: 94,
      location: "Betul, MP",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      price: "₹20,000/month",
      features: ["Reception Service", "Conference Rooms", "IT Support"],
      verified: true,
      premium: true
    },
    {
      id: 6,
      name: "Innovation Hub",
      category: "Tech Center",
      rating: 4.9,
      reviews: 67,
      location: "Betul, MP",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
      price: "₹22,000/month",
      features: ["Lab Equipment", "Mentorship", "Funding Access"],
      verified: true,
      premium: true
    }
  ];

  // Search function using Google Places API
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const results = await searchGooglePlaces(searchQuery);
        setSearchResults(results);
        setShowResults(true);
        
        // Pass search results to BusinessSearch component via localStorage
        localStorage.setItem('heroSearchResults', JSON.stringify(results));
        localStorage.setItem('heroSearchQuery', searchQuery);
        
        // Scroll to BusinessSearch component
        const businessSearchElement = document.getElementById('business-search-section');
        if (businessSearchElement) {
          businessSearchElement.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

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

  // Load Google Maps script if not already loaded
  const loadGoogleMapsScript = async () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

              const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
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

  // Search Google Places API for real business results
  const searchGooglePlaces = async (query: string) => {
    console.log('🔍 Searching Google Places for:', query);
    
    try {
      // Check if Google Maps API is loaded
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        console.log('🔍 Google Maps API not loaded, loading script...');
        await loadGoogleMapsScript();
      }

      // Get current location or use default
      const currentLocation = userLocation || {
        lat: 23.1765,
        lng: 77.5885,
        address: 'Betul, MP (Default)'
      };

      // Create a PlacesService instance
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      // Search for places
      const searchRequest = {
        query: `${query} in ${currentLocation.address}`,
        location: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        radius: 50 * 1000 // 50km radius
      };

      return new Promise<Business[]>((resolve, reject) => {
        service.textSearch(searchRequest, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            console.log('🔍 Google Places results:', results);
            
            const businesses: Business[] = results.map((place, index) => {
              // Get real image from Google Places or use category-based fallback
              let imageUrl = '';
              if (place.photos && place.photos.length > 0) {
                // Use Google Places photo
                const photo = place.photos[0];
                imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=300&photo_reference=${photo.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
              } else {
                // Use category-based fallback images
                const category = place.types?.[0] || 'business';
                imageUrl = getCategoryImage(category);
              }

              return {
                id: `google_${place.place_id || index}`,
                name: place.name || 'Unknown Business',
                description: place.formatted_address || '',
                category: place.types?.[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Business',
                address: place.formatted_address || '',
                city: place.vicinity || currentLocation.address,
                state: currentLocation.address.split(', ')[1] || 'Madhya Pradesh',
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
                  lat: place.geometry?.location?.lat() || currentLocation.lat,
                  lng: place.geometry?.location?.lng() || currentLocation.lng
                },
                business_hours: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                imageUrl: imageUrl
              };
            });

            resolve(businesses);
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

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({
            lat: latitude,
            lng: longitude,
            address: 'Current Location'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set default location
          setUserLocation({
            lat: 23.1765,
            lng: 77.5885,
            address: 'Betul, MP'
          });
        }
      );
    } else {
      // Set default location if geolocation not supported
      setUserLocation({
        lat: 23.1765,
        lng: 77.5885,
        address: 'Betul, MP'
      });
    }
  };

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-purple-600/85 to-secondary/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 float-animation">
        <div className="card-glass p-6 border border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-white">
            <Building className="w-6 h-6 text-accent" />
            <div>
              <span className="text-2xl font-bold">10,000+</span>
              <p className="text-sm opacity-90">Businesses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-32 right-16 float-animation" style={{ animationDelay: "1s" }}>
        <div className="card-glass p-6 border border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-white">
            <Users className="w-6 h-6 text-accent" />
            <div>
              <span className="text-2xl font-bold">50,000+</span>
              <p className="text-sm opacity-90">Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 left-20 float-animation" style={{ animationDelay: "2s" }}>
        <div className="card-glass p-6 border border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-white">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="text-2xl font-bold">4.8</span>
              <p className="text-sm opacity-90">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-3 text-lg font-semibold shadow-xl">
          <TrendingUp className="w-5 h-5 mr-2" />
          Betul's #1 Business Directory
        </Badge>

        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 animate-gradient">Local</span>
          <br />
          Businesses in <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 animate-gradient">Betul</span>
        </h1>

        <p className="text-xl md:text-2xl mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
          Connect with thousands of verified local shops, services, and businesses. 
          Find what you need, when you need it, right in your neighborhood.
        </p>

        {/* Enhanced Hero Search - Matching BusinessSearch Design */}
        <div className="card-glass p-8 mb-10 border border-white/30 shadow-2xl max-w-4xl mx-auto bg-white/10 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto">
            {/* Simple Search Bar - Matching BusinessSearch */}
            <div className="relative">
              <div className="flex items-center bg-white/20 backdrop-blur-xl rounded-full border-2 border-white/30 hover:border-white/50 focus-within:border-white/70 transition-all duration-200 shadow-lg">
                {/* Search Icon */}
                <div className="pl-4 pr-3">
                  <Search className="w-5 h-5 text-white/80" />
                </div>
                
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search for businesses, services, or anything you need..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="flex-1 py-4 pr-4 text-lg text-white placeholder:text-white/70 focus:outline-none border-none bg-transparent"
                />
                
                {/* Right Side Icons */}
                <div className="flex items-center space-x-2 pr-4">
                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/20"
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
                    className="p-1 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/20"
                    title="Select location"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                  
                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    title="Search businesses"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Filter Icon */}
                  <button
                    className="p-1 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/20"
                    title="Show filters"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Current Location Display */}
              <div className="mt-3 text-center">
                <span className="text-sm text-white/80">
                  {userLocation ? `📍 ${userLocation.address}` : '📍 Betul, MP'}
                </span>
              </div>
              
              {/* Quick Suggestions */}
              {searchQuery && !showResults && (
                <div className="mt-4 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                  <div className="text-center mb-3">
                    <p className="text-white/80 text-sm">Quick suggestions for "{searchQuery}"</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['restaurant', 'hospital', 'auto service', 'beauty salon', 'electronics store', 'pharmacy'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch();
                        }}
                        className="bg-white/20 hover:bg-white/30 text-white text-xs py-2 px-3 rounded-lg transition-all duration-300 hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
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
            </div>
          </div>
          
          {/* Search Features */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Verified Businesses</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-purple-400" />
              <span>Premium Services</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-blue-400" />
              <span>Top Rated</span>
            </div>
                    </div>
        </div>
        
        {/* Search Results Grid */}
        {showResults && (
          <div className="mt-12">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Found {searchResults.length} Amazing Businesses
              </h2>
              <p className="text-white/80 text-lg">
                Discover the perfect space for your business needs
              </p>
            </div>
            
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {searchResults.map((business) => (
                <div key={business.id} className="group">
                  {/* Business Card */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/20">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={business.imageUrl}
                        alt={business.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to default business image if loading fails
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop';
                        }}
                        onLoad={() => {
                          // Image loaded successfully
                          console.log(`✅ Image loaded for: ${business.name}`);
                        }}
                      />
                      
                      {/* Loading Overlay */}
                      <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                      
                      {/* Overlay Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {business.is_verified && (
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            ✓ Verified
                          </div>
                        )}
                        {business.is_premium && (
                          <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            ⭐ Premium
                          </div>
                        )}
                      </div>
                      
                      {/* Heart Icon */}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{business.name}</h3>
                          <p className="text-white/70 text-sm">{business.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white/70">{business.city}, {business.state}</div>
                        </div>
                      </div>
                      
                      {/* Rating and Location */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white font-semibold ml-1">{business.rating.toFixed(1)}</span>
                            <span className="text-white/70 text-sm ml-1">({business.total_reviews})</span>
                          </div>
                        </div>
                        <div className="flex items-center text-white/70 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{business.address}</span>
                        </div>
                      </div>
                      
                      {/* Services/Tags */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {business.services.slice(0, 2).map((service, index) => (
                            <span key={index} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                              {service}
                            </span>
                          ))}
                          {business.services.length > 2 && (
                            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                              +{business.services.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                          View Details
                        </button>
                        <button className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-8">
              <button 
                onClick={() => {
                  setShowResults(false);
                  setSearchQuery('');
                }}
                className="bg-white/20 hover:bg-white/30 text-white py-3 px-8 rounded-full font-semibold transition-all duration-300 hover:scale-105 border border-white/30"
              >
                ← Back to Search
              </button>
            </div>
          </div>
        )}
        
        {/* Enhanced Quick Actions */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <Button 
            variant="outline" 
            className="card-glass border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10"
            onClick={() => handleScrollToSection('plans')}
          >
            Register Your Business
          </Button>
          <Button 
            variant="outline" 
            className="card-glass border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10"
            onClick={() => handleScrollToSection('categories')}
          >
            Explore Categories
          </Button>
          <Button 
            variant="outline" 
            className="card-glass border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10"
            onClick={() => handleScrollToSection('plans')}
          >
            View Plans
          </Button>
        </div>
        
        {/* Additional Spacing After Buttons */}
        <div className="h-12 sm:h-16 lg:h-20"></div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-3 bg-gradient-to-b from-white/80 to-white/40 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;