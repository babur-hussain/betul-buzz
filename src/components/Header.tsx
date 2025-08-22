import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Phone, Menu, Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-xl sticky top-0 z-50 border-b border-border/50 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient animate-gradient">BetulBuzz</h1>
              <p className="text-xs text-muted-foreground font-medium">Find Local Businesses</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search businesses, services, products..." 
                className="input-neon pl-12 pr-24 py-4 text-lg font-medium placeholder:text-muted-foreground/70"
              />
              <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-hero py-2 px-6 text-sm">
                Search
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 bg-gradient-surface px-4 py-2 rounded-xl shadow-sm">
              <MapPin className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Betul, MP</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>

            <Button className="btn-hero hidden md:flex shadow-lg hover:shadow-xl">
              List Your Business
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden hover:bg-primary/10 transition-all duration-300">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search in Betul..." 
              className="input-neon pl-12 pr-20 py-4 text-lg font-medium"
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