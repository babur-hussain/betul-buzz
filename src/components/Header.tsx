import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Mic, 
  ChevronDown,
  MapPin,
  User,
  Bell,
  Menu,
  Globe
} from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>EN</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <span className="text-gray-600">We are Hiring</span>
              <span className="text-gray-600">Investor Relations</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">BUSINESS</span>
                <span className="text-gray-600">Leads</span>
              </div>
              <span className="text-gray-600">Advertise</span>
              <span className="text-gray-600">Free Listing</span>
              <Bell className="w-4 h-4 text-gray-600" />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
                Login / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-3xl font-bold">
              <span className="text-blue-600">Just</span>
              <span className="text-orange-500">dial</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex-1 max-w-3xl mx-8">
            <div className="text-2xl font-bold mb-4">
              Search across '<span className="text-blue-600">4.7 Crore+</span>' 
              <span className="text-blue-600"> Businesses</span>
            </div>
            
            <div className="flex">
              {/* Location Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Mumbai"
                  className="w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Input
                  placeholder="Search for Real Estate Agents"
                  className="w-full px-4 py-3 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Mic className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600 cursor-pointer" />
              </div>
              
              {/* Search Button */}
              <Button className="jd-search-btn rounded-l-none">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="px-4 py-2 border border-gray-300 rounded">
              Download App
              <div className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">Jd</div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;