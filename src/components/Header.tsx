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
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";
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
  const navigate = useNavigate();

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
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input 
                  placeholder="Search businesses, services, products..." 
                  className="pl-12 pr-24 py-4 text-lg font-medium placeholder:text-gray-500 bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/20"
                />
                <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-hero py-2 px-6 text-sm">
                  Search
                </Button>
              </div>
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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input 
                placeholder="Search in Betul..." 
                className="pl-12 pr-20 py-4 text-lg font-medium bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-4 focus:ring-primary/20"
              />
              <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-hero py-2 px-4">
                Go
              </Button>
            </div>
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