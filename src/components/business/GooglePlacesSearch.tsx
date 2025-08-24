import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Search, 
  MapPin, 
  Star, 
  Building, 
  Navigation,
  Shield,
  Award,
  Crown,
  Globe,
  Phone,
  Mail,
  Share2,
  Bookmark,
  Heart
} from 'lucide-react';

interface GoogleBusiness {
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

const GooglePlacesSearch: React.FC = () => {
  // Test function to verify JavaScript is working
  const testFunction = () => {
    console.log('🔍 Test function called!');
    alert('Test function works!');
  };
  
  // Test the function immediately
  console.log('🔍 Component loaded, testing function...');
  
  // Test if basic JavaScript is working
  try {
    console.log('🔍 Testing basic JavaScript functionality...');
    
    // Test 1: Inline script
    const testDiv = document.createElement('div');
    testDiv.innerHTML = '<button onclick="alert(\'Inline script works!\')">Test Inline</button>';
    document.body.appendChild(testDiv);
    console.log('🔍 Inline script test added to body');
    
    // Test 2: Direct DOM manipulation
    const testDiv2 = document.createElement('div');
    testDiv2.innerHTML = '<button id="direct-test">Direct DOM Test</button>';
    document.body.appendChild(testDiv2);
    
    const directButton = document.getElementById('direct-test');
    if (directButton) {
      directButton.addEventListener('click', () => {
        alert('Direct DOM event listener works!');
      });
      console.log('🔍 Direct DOM event listener added');
    }
    
    // Test 3: Check for any CSS overlays
    const overlays = document.querySelectorAll('[style*="pointer-events: none"], [style*="z-index"], .overlay, [class*="overlay"]');
    console.log('🔍 Found potential overlays:', overlays);
    
  } catch (error) {
    console.error('🔍 Error testing JavaScript:', error);
  }
  
  setTimeout(() => {
    console.log('🔍 Testing function after 1 second...');
    testFunction();
  }, 1000);
  
  const [businesses, setBusinesses] = useState<GoogleBusiness[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<GoogleBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'completed'>('idle');
  const [savedBusinesses, setSavedBusinesses] = useState<string[]>([]);
  const [favoriteBusinesses, setFavoriteBusinesses] = useState<string[]>([]);

  // Initialize with default location and load saved/favorite businesses
  useEffect(() => {
    const defaultLocation = {
      lat: 23.1765,
      lng: 77.5885,
      address: 'Betul, MP (Default)'
    };
    setUserLocation(defaultLocation);
    
    // Load saved and favorite businesses from localStorage
    const saved = JSON.parse(localStorage.getItem('savedBusinesses') || '[]').map((b: any) => b.id);
    const favorites = JSON.parse(localStorage.getItem('favoriteBusinesses') || '[]').map((b: any) => b.id);
    setSavedBusinesses(saved);
    setFavoriteBusinesses(favorites);
    
    console.log('🔍 Component initialized with location:', defaultLocation);
  }, []);

  // Debug: Log when businesses change
  useEffect(() => {
    console.log('🔍 Businesses state changed:', businesses.length, 'businesses');
    console.log('🔍 Filtered businesses:', filteredBusinesses.length, 'businesses');
    if (filteredBusinesses.length > 0) {
      console.log('🔍 First business sample:', filteredBusinesses[0]);
    }
  }, [businesses, filteredBusinesses]);

  // Load Google Maps script
  const loadGoogleMapsScript = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      console.log('🔑 Loading Google Maps script...');
      console.log('🔑 API Key available:', !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
      console.log('🔑 API Key value:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...');
      
      if (typeof google !== 'undefined' && google.maps) {
        console.log('🔑 Google Maps already loaded');
        resolve();
        return;
      }

      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      console.log('🔑 Script URL:', `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`);
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.error('🔑 No valid Google Maps API key found!');
        reject(new Error('Google Maps API key not configured'));
        return;
      }
      
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
  }, []);

  // Search Google Places API
  const searchGooglePlaces = useCallback(async (query: string, location: { lat: number; lng: number; address: string }) => {
    console.log('🔍 Searching Google Places for:', query, 'near:', location);
    
    try {
      // Load Google Maps script if needed
      await loadGoogleMapsScript();

      // Create a PlacesService instance
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      // Search for places
      const searchRequest = {
        query: `${query} in ${location.address}`,
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: searchFilters.distance * 1000 // Convert km to meters
      };

      return new Promise<GoogleBusiness[]>((resolve, reject) => {
        service.textSearch(searchRequest, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            console.log('🔍 Google Places results:', results);
            
            const businesses: GoogleBusiness[] = results.map((place, index) => ({
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
              updated_at: new Date().toISOString()
            }));

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
  }, [searchFilters.distance, loadGoogleMapsScript]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim() || !userLocation) return;

    setIsLoading(true);
    setSearchStatus('searching');
    console.log('🔍 Starting Google Places search for:', query);
    console.log('🔑 API Key available:', !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    console.log('🔑 API Key value:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...');

    try {
      const results = await searchGooglePlaces(query, userLocation);
      console.log('🔍 Search completed, found:', results.length, 'businesses');
      
      setBusinesses(results);
      setFilteredBusinesses(results);
      setSearchStatus('completed');
    } catch (error) {
      console.error('🔍 Search failed:', error);
      setSearchStatus('completed');
    } finally {
      setIsLoading(false);
    }
  }, [searchGooglePlaces, userLocation]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchFilters(prev => ({ ...prev, query: value }));
    
    // Search after user stops typing
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch(value);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setBusinesses([]);
      setFilteredBusinesses([]);
    }
  };

  // Get business status badges
  const getBusinessStatusBadges = (business: GoogleBusiness) => {
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

  return (
    <div className="space-y-6">
      {/* Saved & Favorite Businesses */}
      {(savedBusinesses.length > 0 || favoriteBusinesses.length > 0) && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              💾 Your Saved & Favorite Businesses
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {savedBusinesses.length > 0 && `${savedBusinesses.length} saved`}
              {savedBusinesses.length > 0 && favoriteBusinesses.length > 0 && ' • '}
              {favoriteBusinesses.length > 0 && `${favoriteBusinesses.length} favorited`}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {savedBusinesses.length > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 px-3 py-2">
                  <Bookmark className="w-3 h-3 mr-1" />
                  Saved: {savedBusinesses.length}
                </Badge>
              )}
              {favoriteBusinesses.length > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-2">
                  <Heart className="w-3 h-3 mr-1" />
                  Favorited: {favoriteBusinesses.length}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔍 Live Google Business Search
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Search real businesses from Google Places API. Use the action buttons to get directions, share, save, and favorite businesses.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            💡 Your saved and favorite businesses are stored locally in your browser
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-white rounded-2xl shadow-xl border-2 border-gray-100 hover:border-blue-200 focus-within:border-blue-400 transition-all duration-300 overflow-hidden">
                <div className="pl-6 pr-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                
                <input
                  type="text"
                  placeholder="Search for real businesses (e.g., restaurants, shops, services)..."
                  value={searchFilters.query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="flex-1 py-5 pr-12 text-lg font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none border-none bg-transparent"
                />
                
                <div className="px-6 py-2 bg-blue-50 border-l border-blue-200">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {userLocation ? `📍 ${userLocation.address}` : '📍 Loading location...'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSearch(searchFilters.query)}
                  disabled={isLoading || !searchFilters.query.trim()}
                  className="h-full px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 rounded-l-none border-l-2 border-gray-100"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {filteredBusinesses.length} businesses found
            {searchFilters.query && (
              <span className="text-sm font-normal text-blue-600 ml-2">
                for "{searchFilters.query}"
              </span>
            )}
            {userLocation && (
              <span className="text-sm font-normal text-green-600 ml-2">
                📍 within {searchFilters.distance}km of {userLocation.address}
              </span>
            )}
          </h2>
          
          {searchStatus === 'completed' && filteredBusinesses.length > 0 && (
            <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              ✅ Live results from Google Places
            </div>
          )}
        </div>
      </div>
      
      {/* Test Button */}
      <div className="text-center mb-4">
        <button 
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg cursor-pointer hover:bg-green-700"
          onClick={() => {
            console.log('🔍 Test button clicked!');
            alert('Test button works! JavaScript is functioning!');
          }}
        >
          🧪 CLICK ME TO TEST
        </button>
      </div>

      {/* OUTSIDE CARD TEST BUTTON */}
      <button 
        style={{
          padding: '15px 30px',
          fontSize: '20px',
          backgroundColor: 'cyan',
          color: 'black',
          border: '4px solid black',
          borderRadius: '10px',
          cursor: 'pointer',
          marginBottom: '20px',
          zIndex: 9999999,
          position: 'relative',
          display: 'block',
          width: '100%'
        }}
        onClick={() => {
          console.log('🔍 OUTSIDE CARD TEST BUTTON CLICKED!');
          alert('OUTSIDE CARD TEST BUTTON WORKS!');
        }}
      >
        🔵 OUTSIDE CARD TEST - CLICK ME!
      </button>
      
      {/* ULTIMATE TEST BUTTON */}
      <div 
        style={{
          padding: '20px',
          backgroundColor: 'magenta',
          color: 'white',
          border: '5px solid black',
          borderRadius: '15px',
          cursor: 'pointer',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          zIndex: 99999999,
          position: 'relative'
        }}
        onClick={() => {
          console.log('🔍 ULTIMATE TEST BUTTON CLICKED!');
          alert('ULTIMATE TEST BUTTON WORKS!');
        }}
        onMouseDown={() => {
          console.log('🔍 ULTIMATE TEST BUTTON MOUSEDOWN!');
          alert('ULTIMATE TEST BUTTON MOUSEDOWN!');
        }}
        onTouchStart={() => {
          console.log('🔍 ULTIMATE TEST BUTTON TOUCHSTART!');
          alert('ULTIMATE TEST BUTTON TOUCHSTART!');
        }}
      >
        🟣 ULTIMATE TEST - CLICK, MOUSEDOWN, OR TOUCH!
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching Google Places...</p>
          </div>
        </div>
      ) : filteredBusinesses.length > 0 ? (
        <div className="space-y-4">
                           {filteredBusinesses.map((business) => {
                   console.log('🔍 Rendering business card:', business.name, business.id);
                   console.log('🔍 Business object:', business);
                   console.log('🔍 Business ID type:', typeof business.id);
                   console.log('🔍 Business location:', business.location);
                   
                   // Validate business data
                   if (!business.id || !business.name) {
                     console.error('🔍 Invalid business data:', business);
                     return null;
                   }
                   
                   return (
                                      <Card key={business.id} className="hover:shadow-lg transition-shadow">
                     <CardContent className="p-6">
                       {/* SUPER SIMPLE TEST BUTTON */}
                       <button 
                         style={{
                           padding: '10px 20px',
                           backgroundColor: 'red',
                           color: 'white',
                           border: 'none',
                           borderRadius: '8px',
                           cursor: 'pointer',
                           marginBottom: '10px',
                           fontSize: '16px',
                           fontWeight: 'bold',
                           zIndex: 99999,
                           position: 'relative'
                         }}
                         onClick={() => {
                           console.log('🔍 SUPER SIMPLE TEST BUTTON CLICKED!');
                           alert('SUPER SIMPLE TEST BUTTON WORKS!');
                         }}
                       >
                         🔴 CLICK ME FIRST!
                       </button>
                       
                       {/* ALTERNATIVE TEST BUTTON */}
                       <button 
                         style={{
                           padding: '10px 20px',
                           backgroundColor: 'orange',
                           color: 'white',
                           border: 'none',
                           borderRadius: '8px',
                           cursor: 'pointer',
                           marginBottom: '10px',
                           marginLeft: '10px',
                           fontSize: '16px',
                           fontWeight: 'bold',
                           zIndex: 99999,
                           position: 'relative'
                         }}
                         onMouseDown={() => {
                           console.log('🔍 ALTERNATIVE TEST BUTTON MOUSEDOWN!');
                           alert('ALTERNATIVE TEST BUTTON MOUSEDOWN WORKS!');
                         }}
                       >
                         🟠 MOUSEDOWN TEST
                       </button>
                       
                       {/* NATIVE HTML BUTTON */}
                       <div 
                         style={{
                           padding: '10px 20px',
                           backgroundColor: 'lime',
                           color: 'black',
                           border: '2px solid black',
                           borderRadius: '8px',
                           cursor: 'pointer',
                           marginBottom: '10px',
                           marginLeft: '10px',
                           fontSize: '16px',
                           fontWeight: 'bold',
                           zIndex: 99999,
                           position: 'relative',
                           display: 'inline-block'
                         }}
                         dangerouslySetInnerHTML={{
                           __html: '<button onclick="alert(\'Native HTML button works!\'); console.log(\'Native HTML clicked!\');" style="background: none; border: none; color: inherit; font: inherit; cursor: pointer; padding: 0; margin: 0; width: 100%; height: 100%;">🟢 NATIVE HTML</button>'
                         }}
                       />
                       
                       <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{business.name.charAt(0)}</span>
                    </div>
                    {/* Simple test button */}
                    <button 
                      className="mt-2 px-2 py-1 text-xs bg-red-500 text-white rounded cursor-pointer"
                      onClick={() => alert(`Test button clicked for ${business.name}!`)}
                    >
                      TEST
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{business.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                        <p className="text-sm text-gray-700 mb-3">{business.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span>{business.rating} ({business.total_reviews} reviews)</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-blue-500 mr-1" />
                            <span>{business.city}, {business.state}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getBusinessStatusBadges(business)}
                        </div>
                        
                                                 <div className="flex flex-wrap gap-2">
                           {business.services.slice(0, 4).map((service, index) => (
                             <Badge key={index} variant="outline" className="text-xs">
                               {service}
                             </Badge>
                           ))}
                           {business.services.length > 4 && (
                             <Badge variant="outline" className="text-xs">
                               +{business.services.length - 4} more
                             </Badge>
                           )}
                         </div>
                         
                                                    {/* Action Buttons */}
                           <div className="flex items-center space-x-2 mt-4 relative z-50">
                             <p className="text-sm text-gray-600 mr-2">Actions:</p>
                           
                           {/* Debug Test Button */}
                           <button 
                             style={{
                               padding: '8px 12px',
                               fontSize: '14px',
                               backgroundColor: '#dcfce7',
                               color: '#166534',
                               border: '2px solid #16a34a',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               zIndex: 9999,
                               position: 'relative'
                             }}
                             onClick={() => {
                               console.log('🔍 Debug button clicked!');
                               console.log('🔍 Business:', business);
                               console.log('🔍 Business ID:', business.id);
                               console.log('🔍 Business Location:', business.location);
                               alert(`Debug: ${business.name} - ID: ${business.id}`);
                             }}
                             title="Debug button to test click events"
                           >
                             🧪 Test
                           </button>
                           
                           {/* SIMPLE TEST BUTTON */}
                           <button 
                             style={{
                               padding: '8px 12px',
                               fontSize: '14px',
                               backgroundColor: 'purple',
                               color: 'white',
                               border: 'none',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               zIndex: 9999,
                               position: 'relative'
                             }}
                             onClick={() => {
                               console.log('🔍 SIMPLE TEST BUTTON CLICKED!');
                               alert('SIMPLE TEST BUTTON WORKS!');
                             }}
                           >
                             🟣 SIMPLE
                           </button>
                           
                           {/* BUSINESS NAME TEST BUTTON */}
                           <button 
                             style={{
                               padding: '8px 12px',
                               fontSize: '14px',
                               backgroundColor: 'brown',
                               color: 'white',
                               border: 'none',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               zIndex: 9999,
                               position: 'relative'
                             }}
                             onClick={() => {
                               console.log('🔍 BUSINESS NAME TEST BUTTON CLICKED!');
                               console.log('🔍 Business name:', business.name);
                               console.log('🔍 Business ID:', business.id);
                               alert(`Business Name: ${business.name}\nBusiness ID: ${business.id}`);
                             }}
                           >
                             🟤 NAME TEST
                           </button>
                           
                           {/* AGGRESSIVE TEST BUTTON */}
                           <button 
                             style={{
                               padding: '12px 24px',
                               fontSize: '18px',
                               backgroundColor: 'yellow',
                               color: 'black',
                               border: '3px solid black',
                               borderRadius: '8px',
                               cursor: 'pointer',
                               zIndex: 999999,
                               position: 'relative',
                               pointerEvents: 'auto',
                               userSelect: 'none',
                               WebkitUserSelect: 'none',
                               MozUserSelect: 'none',
                               msUserSelect: 'none'
                             }}
                             onMouseDown={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               console.log('🔍 AGGRESSIVE TEST BUTTON MOUSEDOWN!');
                               alert('AGGRESSIVE TEST BUTTON MOUSEDOWN WORKS!');
                             }}
                             onMouseUp={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               console.log('🔍 AGGRESSIVE TEST BUTTON MOUSEUP!');
                               alert('AGGRESSIVE TEST BUTTON MOUSEUP WORKS!');
                             }}
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               console.log('🔍 AGGRESSIVE TEST BUTTON CLICK!');
                               alert('AGGRESSIVE TEST BUTTON CLICK WORKS!');
                             }}
                           >
                             🟡 AGGRESSIVE
                           </button>
                           {/* Get Directions Button */}
                           <button 
                             style={{
                               padding: '8px 12px',
                               fontSize: '14px',
                               backgroundColor: '#2563eb',
                               color: 'white',
                               border: 'none',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               zIndex: 9999,
                               position: 'relative',
                               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                             }}
                             onClick={() => {
                               console.log('🔍 Get Directions button clicked for:', business.name);
                               console.log('🔍 Business data:', business);
                               try {
                                 // Create Google Maps directions URL
                                 const destination = `${business.location.lat},${business.location.lng}`;
                                 const placeId = business.id.startsWith('google_') ? business.id.replace('google_', '') : business.id;
                                 const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${placeId}`;
                                 
                                 console.log('🔍 Opening directions URL:', url);
                                 window.open(url, '_blank');
                               } catch (error) {
                                 console.error('🔍 Error opening directions:', error);
                                 // Fallback: open with just coordinates
                                 const url = `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}`;
                                 window.open(url, '_blank');
                               }
                             }}
                             title="Get directions on Google Maps"
                           >
                             <Navigation className="w-4 h-4 mr-2" />
                             Get Directions
                           </button>
                           
                           {/* Share Button */}
                           <button 
                             style={{
                               padding: '8px 12px',
                               fontSize: '14px',
                               backgroundColor: 'white',
                               color: 'black',
                               border: '1px solid #d1d5db',
                               borderRadius: '6px',
                               cursor: 'pointer',
                               zIndex: 9999,
                               position: 'relative',
                               boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                             }}
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
                             <Share2 className="w-4 h-4 mr-2" />
                             Share
                           </button>
                           
                           {/* Save/Bookmark Button */}
                           <button 
                             style={{
                               padding: '8px 12px',
                               fontSize: '14px',
                               backgroundColor: savedBusinesses.includes(business.id) ? '#fef3c7' : 'white',
                               color: savedBusinesses.includes(business.id) ? '#92400e' : 'black',
                               border: `1px solid ${savedBusinesses.includes(business.id) ? '#f59e0b' : '#d1d5db'}`,
                               borderRadius: '6px',
                               cursor: 'pointer',
                               zIndex: 9999,
                               position: 'relative',
                               boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                             }}
                             onClick={() => {
                               console.log('🔍 Save button clicked for:', business.name);
                               alert(`Save button clicked for: ${business.name}`);
                               try {
                                 // Toggle saved state
                                 const savedBusinesses = JSON.parse(localStorage.getItem('savedBusinesses') || '[]');
                                 const isSaved = savedBusinesses.some((b: any) => b.id === business.id);
                                 
                                 if (isSaved) {
                                   const updated = savedBusinesses.filter((b: any) => b.id !== business.id);
                                   localStorage.setItem('savedBusinesses', JSON.stringify(updated));
                                   setSavedBusinesses(updated.map((b: any) => b.id));
                                   alert('Business removed from saved!');
                                 } else {
                                   savedBusinesses.push(business);
                                   localStorage.setItem('savedBusinesses', JSON.stringify(savedBusinesses));
                                   setSavedBusinesses([...savedBusinesses, business.id]);
                                   alert('Business saved!');
                                 }
                               } catch (error) {
                                 console.error('🔍 Error saving business:', error);
                                 alert('Error saving business');
                               }
                             }}
                             title="Save business"
                           >
                             <Bookmark className="w-4 h-4 mr-2" />
                             {savedBusinesses.includes(business.id) ? 'Saved' : 'Save'}
                           </button>
                           
                           {/* Heart/Favorite Button */}
                           <button 
                             style={{
                               padding: '8px 12px',
                               fontSize: '14px',
                               backgroundColor: favoriteBusinesses.includes(business.id) ? '#fee2e2' : 'white',
                               color: favoriteBusinesses.includes(business.id) ? '#991b1b' : 'black',
                               border: `1px solid ${favoriteBusinesses.includes(business.id) ? '#ef4444' : '#d1d5db'}`,
                               borderRadius: '6px',
                               cursor: 'pointer',
                               zIndex: 9999,
                               position: 'relative',
                               boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                             }}
                             onClick={() => {
                               console.log('🔍 Heart button clicked for:', business.name);
                               alert(`Heart button clicked for: ${business.name}`);
                               try {
                                 // Toggle favorite state
                                 const favoriteBusinesses = JSON.parse(localStorage.getItem('favoriteBusinesses') || '[]');
                                 const isFavorite = favoriteBusinesses.some((b: any) => b.id === business.id);
                                 
                                 if (isFavorite) {
                                   const updated = favoriteBusinesses.filter((b: any) => b.id !== business.id);
                                   localStorage.setItem('favoriteBusinesses', JSON.stringify(updated));
                                   setFavoriteBusinesses(updated.map((b: any) => b.id));
                                   alert('Business removed from favorites!');
                                 } else {
                                   favoriteBusinesses.push(business);
                                   localStorage.setItem('favoriteBusinesses', JSON.stringify(favoriteBusinesses));
                                   setFavoriteBusinesses([...favoriteBusinesses, business.id]);
                                   alert('Business added to favorites!');
                                 }
                               } catch (error) {
                                 console.error('🔍 Error favoriting business:', error);
                                 alert('Error favoriting business');
                               }
                             }}
                             title="Add to favorites"
                           >
                             <Heart className="w-4 h-4 mr-2" />
                             {favoriteBusinesses.includes(business.id) ? 'Liked' : 'Like'}
                           </button>
                         </div>
                       </div>
                       
                       <div className="flex flex-col items-end space-y-2">
                         <div className="flex space-x-2">
                           {business.phone && (
                             <Button 
                               size="sm" 
                               variant="outline"
                               onClick={() => window.open(`tel:${business.phone}`)}
                               title="Call business"
                             >
                               <Phone className="w-4 h-4" />
                             </Button>
                           )}
                           {business.website && (
                             <Button 
                               size="sm" 
                               variant="outline"
                               onClick={() => window.open(business.website, '_blank')}
                               title="Visit website"
                             >
                               <Globe className="w-4 h-4" />
                             </Button>
                           )}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>
      ) : searchFilters.query ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600 mb-4">
              Try searching for different terms or check your location
            </p>
            <div className="text-sm text-gray-500">
              <p>💡 Try searching for:</p>
              <ul className="mt-2 space-y-1">
                <li>• "restaurant" or "cafe"</li>
                <li>• "shop" or "store"</li>
                <li>• "hospital" or "clinic"</li>
                <li>• "school" or "college"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Search</h3>
            <p className="text-gray-600 mb-4">
              Enter a search term above to find real businesses from Google Places
            </p>
            
            {/* API Key Status */}
            {(!import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">⚠️ Google Maps API Key Required</h4>
                <p className="text-sm text-red-700 mb-3">
                  To use live Google Places search, you need to add your Google Maps API key to the .env file.
                </p>
                <div className="text-xs text-red-600 font-mono bg-red-100 p-2 rounded">
                  VITE_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GooglePlacesSearch;
