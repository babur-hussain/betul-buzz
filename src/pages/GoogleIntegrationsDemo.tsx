import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Star, 
  Building, 
  Globe, 
  Shield, 
  Award, 
  Crown,
  Navigation,
  Phone,
  Mail,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import PlacesAutocomplete from '../components/ui/places-autocomplete';
import EnhancedGoogleMap from '../components/ui/enhanced-google-map';
import GoogleOAuth from '../components/auth/GoogleOAuth';

// Mock business data for demo
const mockBusinesses = [
  {
    id: '1',
    name: 'Betul Restaurant & Cafe',
    description: 'Authentic local cuisine with modern ambiance. Best biryani in town!',
    category: 'Restaurant & Food',
    address: 'Main Road, Betul',
    city: 'Betul',
    state: 'Madhya Pradesh',
    rating: 4.8,
    total_reviews: 156,
    is_verified: true,
    is_featured: true,
    is_premium: false,
    status: 'active',
    location: { lat: 23.1765, lng: 77.5885 },
    services: ['Home Delivery', 'Online Booking', 'Dine-in'],
    tags: ['Restaurant', 'Cafe', 'Local Food']
  },
  {
    id: '2',
    name: 'Betul Healthcare Center',
    description: 'Comprehensive healthcare services with experienced doctors and modern facilities.',
    category: 'Healthcare',
    address: 'Hospital Road, Betul',
    city: 'Betul',
    state: 'Madhya Pradesh',
    rating: 4.6,
    total_reviews: 89,
    is_verified: true,
    is_featured: false,
    is_premium: true,
    status: 'active',
    location: { lat: 23.1780, lng: 77.5900 },
    services: ['24/7 Service', 'Emergency Service', 'Consultation'],
    tags: ['Healthcare', 'Hospital', 'Medical']
  },
  {
    id: '3',
    name: 'Betul Tech Solutions',
    description: 'Professional IT services, web development, and digital marketing solutions.',
    category: 'Technology',
    address: 'Tech Park, Betul',
    city: 'Betul',
    state: 'Madhya Pradesh',
    rating: 4.9,
    total_reviews: 234,
    is_verified: true,
    is_featured: true,
    is_premium: true,
    status: 'active',
    location: { lat: 23.1750, lng: 77.5860 },
    services: ['Web Development', 'Digital Marketing', 'IT Support'],
    tags: ['Technology', 'IT Services', 'Digital']
  }
];

const GoogleIntegrationsDemo: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('places');

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    console.log('Selected place:', place);
  };

  const handleBusinessClick = (business: any) => {
    setSelectedBusiness(business);
  };

  const handleMapClick = (location: { lat: number; lng: number }) => {
    console.log('Map clicked at:', location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Google Integrations Demo
            </h1>
            <p className="text-gray-600 text-lg">
              Phase 1: Google Places, Enhanced Maps, and OAuth Authentication
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="places" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Google Places</span>
            </TabsTrigger>
            <TabsTrigger value="maps" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Enhanced Maps</span>
            </TabsTrigger>
            <TabsTrigger value="oauth" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Google OAuth</span>
            </TabsTrigger>
          </TabsList>

          {/* Google Places Tab */}
          <TabsContent value="places" className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  🌍 Google Places Autocomplete
                </CardTitle>
                <p className="text-gray-600">
                  Intelligent search with Google Places API integration
                </p>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Search Demo */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Try the Search</h3>
                    <PlacesAutocomplete
                      onPlaceSelect={handlePlaceSelect}
                      placeholder="Search for businesses, places, or addresses..."
                      className="w-full"
                    />
                  </div>

                  {/* Selected Place Info */}
                  {selectedPlace && (
                    <Card className="bg-white">
                      <CardHeader>
                        <CardTitle className="text-lg">Selected Place</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700">Name</h4>
                            <p className="text-gray-600">{selectedPlace.name}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">Address</h4>
                            <p className="text-gray-600">{selectedPlace.formatted_address}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">Types</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedPlace.types?.map((type, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">Rating</h4>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-gray-600">
                                {selectedPlace.rating ? `${selectedPlace.rating}/5` : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Smart Search</h4>
                      <p className="text-sm text-gray-600">Intelligent autocomplete with Google's vast database</p>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Location Aware</h4>
                      <p className="text-sm text-gray-600">Context-aware suggestions based on location</p>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Global Coverage</h4>
                      <p className="text-sm text-gray-600">Access to millions of places worldwide</p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Maps Tab */}
          <TabsContent value="maps" className="space-y-6">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  🗺️ Enhanced Google Maps
                </CardTitle>
                <p className="text-gray-600">
                  Interactive maps with business clustering and advanced features
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Map Controls */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Badge variant="outline" className="px-3 py-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      Business Markers
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <Building className="w-3 h-3 mr-1" />
                      Clustering
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <Navigation className="w-3 h-3 mr-1" />
                      Custom Controls
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Info Windows
                    </Badge>
                  </div>

                  {/* Interactive Map */}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <EnhancedGoogleMap
                      businesses={mockBusinesses}
                      onBusinessClick={handleBusinessClick}
                      onMapClick={handleMapClick}
                      height="500px"
                      showBusinesses={true}
                      clustering={true}
                      customControls={true}
                    />
                  </div>

                  {/* Business List */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockBusinesses.map((business) => (
                      <Card 
                        key={business.id} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedBusiness?.id === business.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleBusinessClick(business)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              business.is_premium ? 'bg-yellow-100' : 
                              business.is_featured ? 'bg-purple-100' : 
                              business.is_verified ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              <span className={`font-bold text-sm ${
                                business.is_premium ? 'text-yellow-600' : 
                                business.is_featured ? 'text-purple-600' : 
                                business.is_verified ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {business.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">{business.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-medium">{business.rating}</span>
                                <span className="text-xs text-gray-500">({business.total_reviews})</span>
                              </div>
                              <div className="flex items-center space-x-1 mt-2">
                                {business.is_verified && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                {business.is_featured && (
                                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                    <Award className="w-3 h-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                                {business.is_premium && (
                                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Map Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span>Interactive Features</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Click markers for business details</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Custom map controls (zoom, type, layers)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Business clustering for better performance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Custom map styling and themes</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Building className="w-5 h-5 text-purple-600" />
                          <span>Business Integration</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Real-time business data display</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Status-based marker colors</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Rich info windows with business details</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Location-based business filtering</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google OAuth Tab */}
          <TabsContent value="oauth" className="space-y-6">
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  🔐 Google OAuth Authentication
                </CardTitle>
                <p className="text-gray-600">
                  Secure authentication with Google OAuth integration
                </p>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* OAuth Demo */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Try Google Sign-In</h3>
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <GoogleOAuth 
                        onSuccess={() => alert('Google OAuth successful!')}
                        onError={(error) => alert(`OAuth error: ${error}`)}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Secure Login</h4>
                      <p className="text-sm text-gray-600">Google's industry-standard security</p>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">One-Click Sign-In</h4>
                      <p className="text-sm text-gray-600">Quick and convenient authentication</p>
                    </Card>
                    <Card className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">Profile Sync</h4>
                      <p className="text-sm text-gray-600">Automatic profile information import</p>
                    </Card>
                  </div>

                  {/* Benefits */}
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Why Google OAuth?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-800">Enhanced Security</h4>
                          <p className="text-sm text-gray-600">Google's robust security infrastructure protects user accounts</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-800">Better User Experience</h4>
                          <p className="text-sm text-gray-600">Faster login process with familiar Google interface</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-800">Trust & Credibility</h4>
                          <p className="text-sm text-gray-600">Users trust Google's authentication system</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-800">Reduced Friction</h4>
                          <p className="text-sm text-gray-600">No need to remember additional passwords</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Next Phase Preview */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 mt-8">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-gray-800">
              🚀 Coming in Phase 2
            </CardTitle>
            <p className="text-gray-600">
              Advanced Google integrations for even better business management
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Google Calendar</h4>
                <p className="text-sm text-gray-600">Appointment booking and business scheduling</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Gmail Integration</h4>
                <p className="text-sm text-gray-600">Direct business communication and inquiries</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Analytics & Insights</h4>
                <p className="text-sm text-gray-600">Business performance tracking and optimization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleIntegrationsDemo;
