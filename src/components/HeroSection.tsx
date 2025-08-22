import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, TrendingUp, Star, Users, Building } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-lenis";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { scrollTo } = useSmoothScroll();

  const handleScrollToSection = (sectionId: string) => {
    scrollTo(`#${sectionId}`, { offset: -80, duration: 1.5 });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-purple-600/85 to-secondary/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 float-animation">
        <div className="card-glass p-6 border border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-white">
            <Building className="w-6 h-6 text-accent" />
            <div>
              <span className="text-2xl font-bold">10,000+</span>
              <p className="text-sm opacity-90">Businesses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-32 right-16 float-animation" style={{ animationDelay: "1s" }}>
        <div className="card-glass p-6 border border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-white">
            <Users className="w-6 h-6 text-accent" />
            <div>
              <span className="text-2xl font-bold">50,000+</span>
              <p className="text-sm opacity-90">Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 left-20 float-animation" style={{ animationDelay: "2s" }}>
        <div className="card-glass p-6 border border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-white">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <span className="text-2xl font-bold">4.8</span>
              <p className="text-sm opacity-90">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-3 text-lg font-semibold shadow-xl">
          <TrendingUp className="w-5 h-5 mr-2" />
          Betul's #1 Business Directory
        </Badge>

        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 animate-gradient">Local</span>
          <br />
          Businesses in <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 animate-gradient">Betul</span>
        </h1>

        <p className="text-xl md:text-2xl mb-10 text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
          Connect with thousands of verified local shops, services, and businesses. 
          Find what you need, when you need it, right in your neighborhood.
        </p>

        {/* Enhanced Hero Search */}
        <div className="card-glass p-8 mb-10 border border-white/30 shadow-2xl max-w-4xl mx-auto bg-white/10 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <Input 
                placeholder="What are you looking for?" 
                className="input-neon pl-12 py-5 text-lg font-medium bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <Input 
                placeholder="Location in Betul" 
                className="input-neon pl-12 py-5 text-lg font-medium bg-white/20 border-white/30 text-white placeholder:text-white/70"
                defaultValue="Betul, Madhya Pradesh"
              />
            </div>
            <Button className="btn-hero py-5 px-10 text-lg font-semibold shadow-2xl hover:shadow-glow-lg">
              <Search className="w-5 h-5 mr-2" />
              Search Now
            </Button>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="flex flex-wrap justify-center gap-6">
          <Button 
            variant="outline" 
            className="card-glass border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10"
            onClick={() => handleScrollToSection('plans')}
          >
            Register Your Business
          </Button>
          <Button 
            variant="outline" 
            className="card-glass border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10"
            onClick={() => handleScrollToSection('categories')}
          >
            Explore Categories
          </Button>
          <Button 
            variant="outline" 
            className="card-glass border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/10"
            onClick={() => handleScrollToSection('plans')}
          >
            View Plans
          </Button>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-3 bg-gradient-to-b from-white/80 to-white/40 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;