import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Phone, 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Building,
  Shield,
  ChevronDown,
  Globe,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, logout, business } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Redirect to dashboard or refresh page
    if (user) {
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  // Load Google Maps script
  const loadGoogleMapsScript = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        reject(new Error('Google Maps API key not configured'));
        return;
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps script'));
      document.head.appendChild(script);
    });
  }, []);

  // Search Google Places API
  const searchGooglePlaces = useCallback(async (query: string) => {
    try {
      console.log('🔍 Header: Searching Google Places for:', query);
      await loadGoogleMapsScript();

      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      const searchRequest = {
        query: `${query} in Betul, MP`,
        location: new google.maps.LatLng(23.1765, 77.5885), // Betul coordinates
        radius: 50000 // 50km radius
      };

      console.log('🔍 Header: Search request:', searchRequest);

      return new Promise<any[]>((resolve, reject) => {
        service.textSearch(searchRequest, (results, status) => {
          console.log('🔍 Header: Google Places response:', { status, resultsCount: results?.length || 0 });
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const businesses = results.slice(0, 5).map((place, index) => ({
              id: `google_${place.place_id || index}`,
              name: place.name || 'Unknown Business',
              category: place.types?.[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Business',
              address: place.formatted_address || '',
              rating: place.rating || 0,
              location: {
                lat: place.geometry?.location?.lat() || 23.1765,
                lng: place.geometry?.location?.lng() || 77.5885
              }
            }));
            console.log('🔍 Header: Processed businesses:', businesses);
            resolve(businesses);
          } else {
            console.log('🔍 Header: Google Places search failed with status:', status);
            resolve([]);
          }
        });
      });
    } catch (error) {
      console.error('🔍 Header: Error searching Google Places:', error);
      return [];
    }
  }, [loadGoogleMapsScript]);

  // Handle search input change with auto-search
  const handleSearchInputChange = (value: string) => {
    console.log('🔍 Header: Search input changed to:', value);
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Clear results if query is empty
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    // Set new timeout for auto-search (500ms delay)
    const timeout = setTimeout(() => {
      console.log('🔍 Header: Auto-search triggered for:', value);
      handleSearch(value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Handle search
  const handleSearch = async (query: string) => {
    console.log('🔍 Header: handleSearch called with:', query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      console.log('🔍 Header: Calling searchGooglePlaces...');
      const results = await searchGooglePlaces(query);
      console.log('🔍 Header: Search results received:', results);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('🔍 Header: Search failed:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle business click
  const handleBusinessClick = (business: any) => {
    // Navigate to Google search page with the business selected
    navigate('/google-search', { state: { selectedBusiness: business } });
    setSearchResults([]);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Super Admin', color: 'bg-red-500', icon: Shield };
      case 'business_owner':
        return { label: 'Business Owner', color: 'bg-blue-500', icon: Building };
      case 'user':
        return { label: 'User', color: 'bg-green-500', icon: User };
      default:
        return { label: 'Unknown', color: 'bg-gray-500', icon: User };
    }
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient animate-gradient">BetulBuzz</h1>
                <p className="text-xs text-gray-600 font-medium">Find Local Businesses</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
              <div className="relative flex-1 search-container">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input 
                  placeholder="Search businesses, services, products..." 
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  className="pl-12 pr-24 py-4 text-lg font-medium placeholder:text-gray-500 bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/20"
                />
                <Button 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-hero py-2 px-6 text-sm"
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((business) => (
                        <div 
                          key={business.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleBusinessClick(business)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{business.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">{business.name}</h4>
                              <p className="text-xs text-gray-600 truncate">{business.category}</p>
                              <p className="text-xs text-gray-500 truncate">{business.address}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">{business.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/google-search')}
                        >
                          View All Results
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No results found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                <MapPin className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-gray-900">Betul, MP</span>
              </div>
              
              {!user ? (
                // Not authenticated - show auth buttons
                <div className="hidden md:flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 rounded-xl"
                    onClick={() => openAuthModal('login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="btn-hero hidden md:flex shadow-lg hover:shadow-xl"
                    onClick={() => openAuthModal('register')}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                // Authenticated - show user menu
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 rounded-xl">
                    <Bell className="w-4 h-4" />
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar_url} alt={user.full_name} />
                          <AvatarFallback className="bg-gradient-primary text-white text-sm">
                            {user.full_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block text-sm font-medium text-gray-700">
                          {user.full_name}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const roleInfo = getRoleDisplay(user.role);
                            const RoleIcon = roleInfo.icon;
                            return (
                              <>
                                <RoleIcon className="w-4 h-4" />
                                <span className="text-sm">{roleInfo.label}</span>
                              </>
                            );
                          })()}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      
                      {user.role === 'business_owner' && business && (
                        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                          <Building className="w-4 h-4 mr-2" />
                          Business Profile
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/google-demo')}>
                        <Globe className="w-4 h-4 mr-2" />
                        Google Demo
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/google-search')}>
                        <Search className="w-4 h-4 mr-2" />
                        Live Google Search
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <Button variant="ghost" size="sm" className="md:hidden hover:bg-gray-100 transition-all duration-300 text-gray-700 hover:text-gray-900">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative search-container">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input 
                placeholder="Search in Betul..." 
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                className="pl-12 pr-20 py-4 text-lg font-medium bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-4 focus:ring-primary/20"
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-hero py-2 px-4"
                onClick={() => handleSearch(searchQuery)}
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Go'
                )}
              </Button>
            </div>
            
            {/* Mobile Search Results */}
            {showSearchResults && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((business) => (
                      <div 
                        key={business.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleBusinessClick(business)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{business.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{business.name}</h4>
                            <p className="text-xs text-gray-600 truncate">{business.category}</p>
                            <p className="text-xs text-gray-500 truncate">{business.address}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">{business.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate('/google-search')}
                      >
                        View All Results
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No results found</p>
                    <p className="text-xs mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Auth Buttons */}
          {!user && (
            <div className="md:hidden mt-4 flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </Button>
              <Button 
                className="flex-1"
                onClick={() => openAuthModal('register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;