import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";

const HeroSection = () => {
  // Promotional banner data
  const [currentSlide, setCurrentSlide] = useState(0);
  const bannerSlides = [
    {
      title: "Time to fly at Lowest Airfares",
      subtitle: "Powered By EaseMyTrip",
      buttonText: "Book Now",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      title: "Get Best Deals on Electronics",
      subtitle: "Powered By Amazon",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      title: "Book Your Dream Home",
      subtitle: "Powered By MagicBricks",
      buttonText: "Explore",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
      bgColor: "from-green-500 to-green-600"
    }
  ];

  // Small promotional posters data
  const smallPosters = [
    {
      title: "Quick Quotes",
      subtitle: "B2B",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
      bgColor: "bg-blue-500",
      buttonText: "Get Quote"
    },
    {
      title: "Get Nearest Vendor",
      subtitle: "REPAIRS & SERVICES",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=150&fit=crop",
      bgColor: "bg-blue-600",
      buttonText: "Find Vendor"
    },
    {
      title: "Finest Agents",
      subtitle: "REAL ESTATE",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=150&fit=crop",
      bgColor: "bg-purple-600",
      buttonText: "Connect"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  // Top Category data (2 rows of 8 icons each)
  const topCategories = [
    { name: 'Restaurants', icon: '🍽️', color: 'bg-orange-100 text-orange-600' },
    { name: 'Hotels', icon: '🏨', color: 'bg-blue-100 text-blue-600' },
    { name: 'Beauty Spa', icon: '💆', color: 'bg-pink-100 text-pink-600' },
    { name: 'Home Decor', icon: '🏠', color: 'bg-green-100 text-green-600' },
    { name: 'Wedding Planning', icon: '💒', color: 'bg-purple-100 text-purple-600', tag: 'WEDDING' },
    { name: 'Education', icon: '🎓', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'Rent & Hire', icon: '📦', color: 'bg-gray-100 text-gray-600' },
    { name: 'Hospitals', icon: '🏥', color: 'bg-red-100 text-red-600' }
  ];

  const bottomCategories = [
    { name: 'Contractors', icon: '🔨', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Pet Shops', icon: '🐕', color: 'bg-orange-100 text-orange-600' },
    { name: 'PG/Hostels', icon: '🏢', color: 'bg-blue-100 text-blue-600' },
    { name: 'Estate Agent', icon: '🏘️', color: 'bg-green-100 text-green-600' },
    { name: 'Dentists', icon: '🦷', color: 'bg-white-100 text-white-600' },
    { name: 'Gym', icon: '💪', color: 'bg-red-100 text-red-600' },
    { name: 'Loans', icon: '💰', color: 'bg-green-100 text-green-600' },
    { name: 'Event Organisers', icon: '🎉', color: 'bg-purple-100 text-purple-600' }
  ];

  const thirdRowCategories = [
    { name: 'Driving Schools', icon: '🚗', color: 'bg-blue-100 text-blue-600' },
    { name: 'Packers & Movers', icon: '📦', color: 'bg-orange-100 text-orange-600' },
    { name: 'Courier Service', icon: '📮', color: 'bg-green-100 text-green-600' },
    { name: 'Popular Categories', icon: '☰', color: 'bg-gray-100 text-gray-600' },
    { name: 'Electricians', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Plumbers', icon: '🔧', color: 'bg-blue-100 text-blue-600' },
    { name: 'Carpenters', icon: '🪚', color: 'bg-orange-100 text-orange-600' },
    { name: 'Painters', icon: '🎨', color: 'bg-purple-100 text-purple-600' }
  ];

  // Themed sections data
  const themedSections = [
    {
      title: "Wedding Requisites",
      items: [
        { name: "Banquet Halls", image: "https://images.unsplash.com/photo-1519167758481-83f550bbd0dc?w=300&h=200&fit=crop" },
        { name: "Bridal Requisite", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce3b7?w=300&h=200&fit=crop" },
        { name: "Caterers", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop" }
      ]
    },
    {
      title: "Beauty & Spa",
      items: [
        { name: "Beauty Parlours", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop" },
        { name: "Spa & Massages", image: "https://images.unsplash.com/photo-1544161512-84f7c68fd1b3?w=300&h=200&fit=crop" },
        { name: "Salons", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=200&fit=crop" }
      ]
    },
    {
      title: "Repairs & Services",
      items: [
        { name: "AC Service", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop" },
        { name: "Car Service", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=200&fit=crop" },
        { name: "Bike Service", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" }
      ]
    },
    {
      title: "Daily Needs",
      items: [
        { name: "Movies", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop" },
        { name: "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop" },
        { name: "Electricians", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop" }
      ]
    }
  ];

  return (
    <section className="bg-white">
      {/* Promotional Banner/Carousel with 1 Big + 3 Small Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Big Carousel Image (Left - 2/3 width) */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-b from-blue-400 via-blue-500 to-blue-300 rounded-2xl overflow-hidden h-80">
              <div className="flex items-center justify-between p-8 h-full">
                <div className="flex-1 text-blue-900">
                  <h2 className="text-3xl font-bold mb-2">
                    <span className="text-blue-900">Time to fly at</span>
                    <br />
                    <span className="text-blue-900 text-4xl">Lowest Airfares</span>
                  </h2>
                  <Button className="bg-blue-900 text-white hover:bg-blue-800 px-6 py-3 rounded-lg font-semibold mb-4">
                    Book Now
                  </Button>
                  <div className="flex items-center text-blue-900 text-sm">
                    <span className="mr-2">Powered by</span>
                    <span className="font-semibold">EaseMyTrip.com</span>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  {/* Airplane */}
                  <div className="absolute top-4 right-20 z-10">
                    <div className="text-white text-4xl transform rotate-45">✈️</div>
                  </div>
                  {/* Suitcase with window */}
                  <div className="relative">
                    <div className="w-48 h-32 bg-yellow-400 rounded-lg border-4 border-yellow-500 relative">
                      {/* Suitcase handle */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-yellow-500 rounded-full"></div>
                      {/* Window with Eiffel Tower */}
                      <div className="absolute top-4 right-4 w-16 h-16 bg-blue-200 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="text-xs text-blue-800">🗼</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {bannerSlides.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Small Promotional Posters (Right - 1/3 width) */}
          <div className="lg:col-span-1 space-y-4">
            {smallPosters.map((poster, index) => (
              <div key={index} className={`${poster.bgColor} rounded-xl overflow-hidden h-24 relative`}>
                <div className="flex items-center justify-between p-4 h-full">
                  <div className="flex-1 text-white">
                    <div className="text-xs font-medium opacity-90 mb-1">{poster.subtitle}</div>
                    <h3 className="text-sm font-bold mb-2">{poster.title}</h3>
                  </div>
                  <div className="hidden sm:block">
                    <img 
                      src={poster.image}
                      alt={poster.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  {/* Right chevron */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Far Right Vertical Strips */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            {/* Advertise Strip */}
            <div className="bg-orange-500 rounded-lg h-24 flex items-center justify-center">
              <div className="text-white font-bold text-sm writing-mode-vertical transform -rotate-90">
                Advertise
              </div>
            </div>
            {/* Free Listing Strip */}
            <div className="bg-blue-600 rounded-lg h-24 flex items-center justify-center">
              <div className="text-white font-bold text-sm writing-mode-vertical transform -rotate-90">
                Free Listing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Category Grid (2 rows of 8 icons each) */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-6">
          {topCategories.map((category, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className="text-xs text-gray-700 font-medium">
                {category.name}
                {category.tag && (
                  <Badge className="ml-1 bg-primary text-white text-xs px-1 py-0.5">
                    {category.tag}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Category Grid (1 row of 8 icons) */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {bottomCategories.map((category, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className="text-xs text-gray-700 font-medium">{category.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Third Row Category Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {thirdRowCategories.map((category, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className="text-xs text-gray-700 font-medium">{category.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Themed Sections with Image Cards */}
      <div className="container mx-auto px-4 py-6">
        {themedSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 text-center">{item.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bills & Recharge Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-bold text-gray-900">Bills & Recharge</h3>
                <Badge className="ml-2 bg-blue-100 text-blue-600 text-xs">Bharat Connect</Badge>
              </div>
              <p className="text-gray-600 mb-4">Pay your bills & recharge instantly with BetulBuzz</p>
              <a href="#" className="text-primary font-medium hover:underline">Explore More</a>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { name: 'Mobile', icon: '📱', color: 'bg-green-100 text-green-600' },
                { name: 'Electricity', icon: '⚡', color: 'bg-yellow-100 text-yellow-600' },
                { name: 'DTH', icon: '📺', color: 'bg-blue-100 text-blue-600' },
                { name: 'Water', icon: '💧', color: 'bg-blue-100 text-blue-600' },
                { name: 'Gas', icon: '🔥', color: 'bg-orange-100 text-orange-600' },
                { name: 'Insurance', icon: '🛡️', color: 'bg-purple-100 text-purple-600' }
              ].map((service, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform`}>
                    <span className="text-lg">{service.icon}</span>
                  </div>
                  <div className="text-xs text-gray-700 font-medium">{service.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Travel Bookings Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Travel Bookings</h3>
              <p className="text-gray-600 mb-4">Instant ticket bookings for your best travel experience</p>
              <a href="#" className="text-primary font-medium hover:underline">Explore More</a>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[
                { name: 'Flight', icon: '✈️', subtext: 'Powered By Easemytrip.com', color: 'bg-blue-100 text-blue-600' },
                { name: 'Bus', icon: '🚌', subtext: 'Affordable Rides', color: 'bg-green-100 text-green-600' },
                { name: 'Train', icon: '🚂', subtext: '', color: 'bg-orange-100 text-orange-600' },
                { name: 'Hotel', icon: '🏨', subtext: 'Budget-friendly Stay', color: 'bg-purple-100 text-purple-600' },
                { name: 'Car Rentals', icon: '🚗', subtext: 'Drive Easy Anywhere', color: 'bg-red-100 text-red-600' }
              ].map((service, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-2 cursor-pointer hover:scale-110 transition-transform`}>
                    <span className="text-lg">{service.icon}</span>
                  </div>
                  <div className="text-xs text-gray-700 font-medium mb-1">{service.name}</div>
                  {service.subtext && (
                    <div className="text-xs text-gray-500">{service.subtext}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Searches Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Trending Searches Near You</h3>
              <Badge className="ml-2 bg-red-500 text-white text-xs">NEW</Badge>
            </div>
          </div>
          <p className="text-gray-600 mb-6">Stay updated with the latest local trends.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Restaurants near me',
              'Best doctors in Betul',
              'Hotels with AC',
              'Car repair service',
              'Beauty salon appointment',
              'Gym membership deals'
            ].map((search, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="text-sm text-gray-700 font-medium">{search}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
