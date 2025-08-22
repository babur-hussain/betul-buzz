import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Menu, Bell, User } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-lenis";

const Header = () => {
  const { scrollTo } = useSmoothScroll();

  const handleScrollToSection = (sectionId: string) => {
    scrollTo(`#${sectionId}`, { offset: -80, duration: 1.5 });
  };

  return (
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
            
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 rounded-xl"
                onClick={() => handleScrollToSection('categories')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Categories
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 rounded-xl"
                onClick={() => handleScrollToSection('businesses')}
              >
                <User className="w-4 h-4 mr-2" />
                Businesses
              </Button>
            </div>

            <Button 
              className="btn-hero hidden md:flex shadow-lg hover:shadow-xl"
              onClick={() => handleScrollToSection('plans')}
            >
              List Your Business
            </Button>

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
      </div>
    </header>
  );
};

export default Header;