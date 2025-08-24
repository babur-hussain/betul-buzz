import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const HeroSection = () => {
  const banners = [
    {
      id: 1,
      title: "Get Loan Against Property",
      subtitle: "At a competitive interest rate starting from 9%",
      provider: "Jio Finance Limited",
      cta: "Apply Now",
      bgColor: "bg-gradient-to-r from-orange-100 to-orange-50",
      textColor: "text-orange-800",
      image: "/api/placeholder/400/200"
    },
    {
      id: 2,
      title: "B2B Quick Quotes",
      subtitle: "Get instant quotes from verified suppliers",
      provider: "Business Solutions",
      cta: "Explore",
      bgColor: "bg-gradient-to-r from-blue-100 to-blue-50",
      textColor: "text-blue-800",
      image: "/api/placeholder/400/200"
    },
    {
      id: 3,
      title: "REPAIRS & SERVICES",
      subtitle: "Get Nearest Vendor",
      provider: "Home Services",
      cta: "Book Now",
      bgColor: "bg-gradient-to-r from-indigo-100 to-indigo-50",
      textColor: "text-indigo-800",
      image: "/api/placeholder/400/200"
    },
    {
      id: 4,
      title: "REAL ESTATE",
      subtitle: "Finest Agents",
      provider: "Property Experts",
      cta: "Find Now",
      bgColor: "bg-gradient-to-r from-purple-100 to-purple-50",
      textColor: "text-purple-800",
      image: "/api/placeholder/400/200"
    },
    {
      id: 5,
      title: "DOCTORS",
      subtitle: "Book Now",
      provider: "Healthcare Services",
      cta: "Book Appointment",
      bgColor: "bg-gradient-to-r from-green-100 to-green-50",
      textColor: "text-green-800",
      image: "/api/placeholder/400/200"
    }
  ];

  return (
    <section className="py-8 bg-[hsl(var(--promotion-bg))]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Banner Carousel */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`jd-service-banner min-w-[280px] flex-shrink-0 ${banner.bgColor} ${banner.textColor} relative overflow-hidden`}
              >
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1 p-4">
                    <h3 className="font-bold text-lg mb-2">{banner.title}</h3>
                    <p className="text-sm mb-1">{banner.subtitle}</p>
                    <p className="text-xs text-gray-600 mb-4">from {banner.provider}</p>
                    <Button 
                      size="sm" 
                      className={`${banner.textColor} bg-white hover:bg-gray-50 border`}
                    >
                      {banner.cta} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <div className="w-12 h-12 bg-white/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
            <ChevronLeft className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
            <ChevronRight className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;