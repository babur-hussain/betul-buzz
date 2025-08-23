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
  Crown
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
  }, []);

  // Filter businesses when filters change
  useEffect(() => {
    filterBusinesses();
  }, [businesses, searchFilters, sortBy]);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active')
        .eq('is_verified', true);

      if (error) throw error;

      if (data) {
        setBusinesses(data);
        setFilteredBusinesses(data);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBusinesses = useCallback(() => {
    let filtered = [...businesses];

    // Text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        business.services.some(service => service.toLowerCase().includes(query)) ||
        business.tags.some(tag => tag.toLowerCase().includes(query))
      );
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
          // TODO: Implement distance calculation
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
      setSearchFilters(prev => ({
        ...prev,
        location: place.formatted_address || place.name || ''
      }));
      
      // TODO: Filter businesses by distance from selected location
    }
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
            {/* Main Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1">
                <PlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Search for businesses, places, or addresses..."
                  value={searchFilters.query}
                  onChange={(value) => setSearchFilters(prev => ({ ...prev, query: value }))}
                />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
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
          </h2>
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
            <Button onClick={resetFilters} variant="outline">
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessSearch;
