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

const BusinessSearch: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
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

  // Business categories
  const businessCategories = [
    'All Categories',
    'Restaurant & Food',
    'Healthcare',
    'Education',
    'Retail & Shopping',
    'Automotive',
    'Beauty & Wellness',
    'Home & Garden',
    'Technology',
    'Entertainment',
    'Professional Services',
    'Real Estate',
    'Travel & Tourism',
    'Sports & Fitness',
    'Art & Culture',
    'Other'
  ];

  // Services
  const availableServices = [
    'Home Delivery',
    'Online Booking',
    '24/7 Service',
    'Free Consultation',
    'Warranty',
    'Installation',
    'Maintenance',
    'Emergency Service',
    'Mobile Service',
    'Pickup & Drop'
  ];

  // Price ranges
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Budget Friendly' },
    { value: 'medium', label: 'Mid Range' },
    { value: 'high', label: 'Premium' }
  ];

  // Fetch businesses
  useEffect(() => {
    fetchBusinesses();
    // Automatically get user location when component mounts
    getUserLocation();
  }, [getUserLocation]);

  // Filter businesses when filters change
  useEffect(() => {
    filterBusinesses();
  }, [businesses, searchFilters, sortBy]);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all active businesses
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      if (data) {
        // Add mock businesses if none exist (for demo purposes)
        let businessData = data;
        if (data.length === 0) {
          businessData = [
            {
              id: '1',
              name: 'Kapoor & Sons Restaurant',
              description: 'Authentic local cuisine with modern ambiance. Best biryani in town!',
              category: 'Restaurant & Food',
              address: 'Kapoor Complex, Housing Board Colony Rd, Betul',
              city: 'Betul',
              state: 'Madhya Pradesh',
              pincode: '460001',
              phone: '+91-1234567890',
              email: 'info@kapoorandsons.com',
              website: 'https://kapoorandsons.com',
              services: ['Home Delivery', 'Online Booking', 'Dine-in', 'Catering'],
              tags: ['Restaurant', 'Cafe', 'Local Food', 'Biryani'],
              rating: 4.8,
              total_reviews: 156,
              is_verified: true,
              is_featured: true,
              is_premium: false,
              status: 'active',
              location: { lat: 23.1765, lng: 77.5885 },
              business_hours: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Betul Healthcare Center',
              description: 'Comprehensive healthcare services with experienced doctors and modern facilities.',
              category: 'Healthcare',
              address: 'Hospital Road, Betul',
              city: 'Betul',
              state: 'Madhya Pradesh',
              pincode: '460001',
              phone: '+91-9876543210',
              email: 'care@betulhealth.com',
              website: 'https://betulhealth.com',
              services: ['24/7 Service', 'Emergency Service', 'Consultation', 'Lab Tests'],
              tags: ['Healthcare', 'Hospital', 'Medical', 'Emergency'],
              rating: 4.6,
              total_reviews: 89,
              is_verified: true,
              is_featured: false,
              is_premium: true,
              status: 'active',
              location: { lat: 23.1780, lng: 77.5900 },
              business_hours: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '3',
              name: 'Betul Tech Solutions',
              description: 'Professional IT services, web development, and digital marketing solutions.',
              category: 'Technology',
              address: 'Tech Park, Betul',
              city: 'Betul',
              state: 'Madhya Pradesh',
              pincode: '460001',
              phone: '+91-8765432109',
              email: 'hello@betultech.com',
              website: 'https://betultech.com',
              services: ['Web Development', 'Digital Marketing', 'IT Support', 'Mobile Apps'],
              tags: ['Technology', 'IT Services', 'Digital', 'Web Development'],
              rating: 4.9,
              total_reviews: 234,
              is_verified: true,
              is_featured: true,
              is_premium: true,
              status: 'active',
              location: { lat: 23.1750, lng: 77.5860 },
              business_hours: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '4',
              name: 'Betul Auto Service',
              description: 'Complete automotive service and repair center with certified mechanics.',
              category: 'Automotive',
              address: 'Auto Nagar, Betul',
              city: 'Betul',
              state: 'Madhya Pradesh',
              pincode: '460001',
              phone: '+91-7654321098',
              email: 'service@betulauto.com',
              website: 'https://betulauto.com',
              services: ['Car Service', 'Repair', 'Towing', 'Spare Parts'],
              tags: ['Automotive', 'Car Service', 'Repair', 'Spare Parts'],
              rating: 4.5,
              total_reviews: 67,
              is_verified: true,
              is_featured: false,
              is_premium: false,
              status: 'active',
              location: { lat: 23.1790, lng: 77.5850 },
              business_hours: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '5',
              name: 'Betul Beauty Salon',
              description: 'Professional beauty and wellness services for men and women.',
              category: 'Beauty & Wellness',
              address: 'Beauty Plaza, Betul',
              city: 'Betul',
              state: 'Madhya Pradesh',
              pincode: '460001',
              phone: '+91-6543210987',
              email: 'beauty@betulsalon.com',
              website: 'https://betulsalon.com',
              services: ['Hair Styling', 'Facial', 'Manicure', 'Pedicure'],
              tags: ['Beauty', 'Salon', 'Wellness', 'Hair Care'],
              rating: 4.7,
              total_reviews: 123,
              is_verified: true,
              is_featured: true,
              is_premium: false,
              status: 'active',
              location: { lat: 23.1740, lng: 77.5890 },
              business_hours: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '6',
              name: 'Keiken Cafe & Restaurant',
              description: 'Modern Japanese-inspired cafe with fusion cuisine, specialty coffee, and cozy atmosphere. Perfect for meetings and casual dining.',
              category: 'Restaurant & Food',
              address: 'Cafe Street, Betul',
              city: 'Betul',
              state: 'Madhya Pradesh',
              pincode: '460001',
              phone: '+91-5432109876',
              email: 'hello@keikencafe.com',
              website: 'https://keikencafe.com',
              services: ['Dine-in', 'Takeaway', 'Coffee', 'Fusion Food', 'WiFi'],
              tags: ['Cafe', 'Restaurant', 'Japanese', 'Fusion', 'Coffee', 'Modern'],
              rating: 4.9,
              total_reviews: 89,
              is_verified: true,
              is_featured: true,
              is_premium: true,
              status: 'active',
              location: { lat: 23.1770, lng: 77.5870 },
              business_hours: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '7',
              name: 'Kapoor & Sons Restaurant',
              description: 'Authentic Indian cuisine with traditional recipes passed down through generations. Famous for their biryani, kebabs, and North Indian dishes.',
              category: 'Restaurant & Food',
              address: 'Kapoor Complex, Housing Board Colony Rd, Betul',
              city: 'Betul',
              state: 'Madhya Pradesh',
              pincode: '460001',
              phone: '+91-1234567890',
              email: 'info@kapoorandsons.com',
              website: 'https://kapoorandsons.com',
              services: ['Dine-in', 'Home Delivery', 'Online Booking', 'Catering', 'Takeaway'],
              tags: ['Restaurant', 'Indian Food', 'Biryani', 'Kebabs', 'Traditional', 'Family Restaurant'],
              rating: 4.8,
              total_reviews: 156,
              is_verified: true,
              is_featured: true,
              is_premium: false,
              status: 'active',
              location: { lat: 23.1760, lng: 77.5890 },
              business_hours: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ];
        }
        
        setBusinesses(businessData);
        setFilteredBusinesses(businessData);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoading(false);
    }
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
  const searchNearbyBusinesses = useCallback((query: string) => {
    if (!userLocation) {
      // If no location yet, get it first
      getUserLocation();
      return;
    }

    let filtered = [...businesses];

    // Text search if query provided
    if (query.trim()) {
      const queryWords = query.toLowerCase().trim().split(' ').filter(word => word.length > 0);
      
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
        
        return queryWords.every(word => businessText.includes(word));
      });
    }

    // Add distance to all businesses
    const businessesWithDistance = filtered.map(business => ({
      ...business,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        business.location.lat,
        business.location.lng
      )
    }));

    // Filter by distance and sort by proximity
    const nearbyBusinesses = businessesWithDistance
      .filter(business => business.distance <= searchFilters.distance)
      .sort((a, b) => a.distance - b.distance);

    setFilteredBusinesses(nearbyBusinesses);
    setSearchStatus('completed');
  }, [businesses, userLocation, searchFilters.distance, getUserLocation]);

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
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find the Perfect Business
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Discover verified businesses in Betul and surrounding areas
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Single Smart Search Bar - Auto Location Detection */}
            <div className="relative">
              <div className="flex items-center bg-white rounded-2xl shadow-xl border-2 border-gray-100 hover:border-blue-200 focus-within:border-blue-400 transition-all duration-300 overflow-hidden">
                {/* Search Icon */}
                <div className="pl-6 pr-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                
                {/* Single Search Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for businesses, services, or anything you need..."
                    value={searchFilters.query}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchFilters(prev => ({ ...prev, query: value }));
                      
                      // Real-time search as user types
                      if (value.trim()) {
                        setTimeout(() => {
                          searchNearbyBusinesses(value);
                        }, 300);
                      } else {
                        // Show nearby businesses if search is empty
                        searchNearbyBusinesses('');
                      }
                    }}
                    className="w-full py-5 pr-12 text-lg font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none border-none bg-transparent"
                  />
                  {/* Clear Button */}
                  {searchFilters.query && (
                    <button
                      onClick={() => {
                        setSearchFilters(prev => ({ ...prev, query: '' }));
                        searchNearbyBusinesses('');
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Location Status */}
                <div className="px-6 py-2 bg-blue-50 border-l border-blue-200">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {userLocation ? '📍 Near You' : '📍 Detecting Location...'}
                    </span>
                  </div>
                </div>
                
                {/* Search Button */}
                <Button 
                  onClick={() => {
                    setSearchStatus('searching');
                    setTimeout(() => {
                      searchNearbyBusinesses(searchFilters.query);
                      setSearchStatus('completed');
                    }, 500);
                  }}
                  disabled={searchStatus === 'searching'}
                  className="h-full px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 rounded-l-none border-l-2 border-gray-100"
                >
                  {searchStatus === 'searching' ? (
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
              
              {/* Location Info & Quick Actions */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>
                      {userLocation ? `Within ${searchFilters.distance}km of your location` : 'Getting your location...'}
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
                📍 within {searchFilters.distance}km of you
              </span>
            )}
          </h2>
          
          {/* Search Summary */}
          {searchStatus === 'completed' && filteredBusinesses.length > 0 && (
            <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              ✅ Search completed successfully
            </div>
          )}
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
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
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Building className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="w-full">
        <TabsContent value="list" className="space-y-4">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
                                                                             <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                <span className="font-medium">{business.rating.toFixed(1)}</span>
                                <span className="text-gray-500 ml-1">({business.total_reviews})</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{business.city}, {business.state}</span>
                              </div>
                              {business.distance !== undefined && userLocation && (
                                <div className="flex items-center text-green-600 font-medium">
                                  <Navigation className="w-4 h-4 mr-1" />
                                  <span>{business.distance.toFixed(1)} km away</span>
                                </div>
                              )}
                            </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getBusinessStatusBadges(business)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3 line-clamp-2">{business.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
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
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
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

        <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">{business.name.charAt(0)}</span>
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
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="map" className="h-96">
          <EnhancedGoogleMap
            businesses={filteredBusinesses}
            onBusinessClick={handleBusinessClick}
            onMapClick={handleMapClick}
            height="600px"
            showBusinesses={true}
            clustering={true}
            customControls={true}
          />
        </TabsContent>
      </Tabs>

              {/* No Results */}
        {filteredBusinesses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              
              {/* Search Suggestions */}
              <div className="mt-6 text-left max-w-2xl mx-auto">
                <h4 className="font-medium text-gray-800 mb-3">Search Suggestions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Try these searches:</p>
                    <ul className="space-y-1">
                      <li>• "keiken cafe" or "cafe"</li>
                      <li>• "restaurant" or "food"</li>
                      <li>• "hospital" or "clinic"</li>
                      <li>• "auto service" or "car repair"</li>
                      <li>• "beauty salon" or "spa"</li>
                    </ul>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Location tips:</p>
                    <ul className="space-y-1">
                      <li>• Enter "Betul, MP" as location</li>
                      <li>• Use "Find Near Me" button</li>
                      <li>• Try specific areas like "Housing Board Colony"</li>
                      <li>• Check distance filter (currently: {searchFilters.distance} km)</li>
                      <li>• Try "Show All" to see all businesses</li>
                    </ul>
                  </div>
                </div>
                
                {/* Quick Search Buttons */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchFilters(prev => ({ ...prev, query: 'keiken cafe' }));
                      searchNearbyBusinesses('keiken cafe');
                    }}
                    className="text-xs px-3 py-1"
                  >
                    Search "keiken cafe"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchFilters(prev => ({ ...prev, query: 'restaurant' }));
                      searchNearbyBusinesses('restaurant');
                    }}
                    className="text-xs px-3 py-1"
                  >
                    Search "restaurant"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchFilters(prev => ({ ...prev, query: 'cafe' }));
                      searchNearbyBusinesses('cafe');
                    }}
                    className="text-xs px-3 py-1"
                  >
                    Search "cafe"
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchFilters(prev => ({ ...prev, query: 'kapoor' }));
                      searchNearbyBusinesses('kapoor');
                    }}
                    className="text-xs px-3 py-1"
                  >
                    Search "kapoor"
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 space-x-3">
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
                <Button 
                  onClick={() => {
                    // Show all businesses
                    setFilteredBusinesses(businesses);
                  }}
                  variant="default"
                >
                  Show All Businesses
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default BusinessSearch;
