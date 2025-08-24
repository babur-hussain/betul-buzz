import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Bell, 
  ChevronDown,
  Globe,
  Download,
  Mic
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

const Header = () => {
  // Search state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  // Search function using Google Places API
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const results = await searchGooglePlaces(`${searchQuery} in ${selectedCity}`);
        setSearchResults(results);
        setShowResults(true);
        
        // Pass search results to BusinessSearch component via localStorage
        localStorage.setItem('heroSearchResults', JSON.stringify(results));
        localStorage.setItem('heroSearchQuery', `${searchQuery} in ${selectedCity}`);
        
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
      const currentLocation = {
        lat: 23.1765,
        lng: 77.5885,
        address: 'Betul, MP'
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
                imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
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

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top Navigation Bar */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Left side */}
            <div className="flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    <Globe className="w-4 h-4 mr-1" />
                    EN
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>English</DropdownMenuItem>
                  <DropdownMenuItem>Hindi</DropdownMenuItem>
                  <DropdownMenuItem>Gujarati</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">We are Hiring</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Investor Relations</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Leads</a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Advertise</a>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs px-1 py-0.5">
                  BUSINESS
                </Badge>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Free Listing</a>
              </div>
              
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button className="h-8 px-4 text-sm bg-primary hover:bg-primary/90">
                Login / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header with Logo and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-primary">BetulBuzz</h1>
          </div>

          {/* Download App Button */}
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Download App
            <Badge className="ml-2 bg-primary text-white text-xs">Jd</Badge>
          </Button>
        </div>

        {/* Main Search Area */}
        <div className="search-container relative max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-lg p-2">
            {/* Location Input */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 pl-10 pr-4 border-0 text-left font-medium text-gray-900 bg-transparent hover:bg-gray-50 rounded-lg">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Betul', 'Bhopal', 'Indore'].map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for Spa & Salons"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-12 pl-10 pr-12 border-0 text-left font-medium text-gray-900 bg-transparent hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Mic className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer hover:text-primary" />
            </div>

            {/* Search Button */}
            <Button
              className="h-12 w-12 bg-orange-500 hover:bg-orange-600 p-0 rounded-lg"
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {searchResults.map((business) => (
                <div key={business.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{business.name}</h4>
                      <p className="text-sm text-gray-500">{business.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{business.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">{business.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;