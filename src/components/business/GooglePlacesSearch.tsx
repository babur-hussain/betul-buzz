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
  }, []);

  // Load Google Maps script
  const loadGoogleMapsScript = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      console.log('🔑 Loading Google Maps script...');
      console.log('🔑 API Key available:', !!process.env.VITE_GOOGLE_MAPS_API_KEY);
      console.log('🔑 API Key value:', process.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...');
      
      if (typeof google !== 'undefined' && google.maps) {
        console.log('🔑 Google Maps already loaded');
        resolve();
        return;
      }

      const script = document.createElement('script');
      const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
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
    console.log('🔑 API Key available:', !!process.env.VITE_GOOGLE_MAPS_API_KEY);
    console.log('🔑 API Key value:', process.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10) + '...');

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
      {/* Search Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🔍 Live Google Business Search
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Search real businesses from Google Places API
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
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{business.name.charAt(0)}</span>
                    </div>
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
                         <div className="flex items-center space-x-2 mt-4">
                           {/* Get Directions Button */}
                           <Button 
                             size="sm" 
                             className="bg-blue-600 hover:bg-blue-700 text-white"
                             onClick={() => {
                               const url = `https://www.google.com/maps/dir/?api=1&destination=${business.location.lat},${business.location.lng}&destination_place_id=${business.id.replace('google_', '')}`;
                               window.open(url, '_blank');
                             }}
                             title="Get directions on Google Maps"
                           >
                             <Navigation className="w-4 h-4 mr-2" />
                             Get Directions
                           </Button>
                           
                           {/* Share Button */}
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => {
                               if (navigator.share) {
                                 navigator.share({
                                   title: business.name,
                                   text: `Check out ${business.name} at ${business.address}`,
                                   url: window.location.href
                                 });
                               } else {
                                 // Fallback: copy to clipboard
                                 navigator.clipboard.writeText(`${business.name} - ${business.address}`);
                                 // You could add a toast notification here
                               }
                             }}
                             title="Share business"
                           >
                             <Share2 className="w-4 h-4" />
                           </Button>
                           
                           {/* Save/Bookmark Button */}
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => {
                               // Toggle saved state
                               const savedBusinesses = JSON.parse(localStorage.getItem('savedBusinesses') || '[]');
                               const isSaved = savedBusinesses.some((b: any) => b.id === business.id);
                               
                               if (isSaved) {
                                 const updated = savedBusinesses.filter((b: any) => b.id !== business.id);
                                 localStorage.setItem('savedBusinesses', JSON.stringify(updated));
                               } else {
                                 savedBusinesses.push(business);
                                 localStorage.setItem('savedBusinesses', JSON.stringify(savedBusinesses));
                               }
                               
                               // Force re-render to update button state
                               setBusinesses([...businesses]);
                             }}
                             title="Save business"
                             className={savedBusinesses.includes(business.id) ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                           >
                             <Bookmark className="w-4 h-4" />
                           </Button>
                           
                           {/* Heart/Favorite Button */}
                           <Button 
                             size="sm" 
                             variant="outline"
                             onClick={() => {
                               // Toggle favorite state
                               const favoriteBusinesses = JSON.parse(localStorage.getItem('favoriteBusinesses') || '[]');
                               const isFavorite = favoriteBusinesses.some((b: any) => b.id === business.id);
                               
                               if (isFavorite) {
                                 const updated = favoriteBusinesses.filter((b: any) => b.id !== business.id);
                                 localStorage.setItem('favoriteBusinesses', JSON.stringify(updated));
                               } else {
                                 favoriteBusinesses.push(business);
                                 localStorage.setItem('favoriteBusinesses', JSON.stringify(favoriteBusinesses));
                               }
                               
                               // Force re-render to update button state
                               setBusinesses([...businesses]);
                             }}
                             title="Add to favorites"
                             className={favoriteBusinesses.includes(business.id) ? 'bg-red-100 text-red-800 border-red-300' : ''}
                           >
                             <Heart className="w-4 h-4" />
                           </Button>
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
          ))}
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
            {(!process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') && (
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
