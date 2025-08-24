import React from 'react';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const FeaturedBusinesses = () => {
  const weddingServices = [
    {
      id: 1,
      name: "Banquet Halls",
      image: "/api/placeholder/300/200",
      description: "Perfect venues for your special day"
    },
    {
      id: 2,
      name: "Bridal Requisite",
      image: "/api/placeholder/300/200",
      description: "Everything you need for the bride"
    },
    {
      id: 3,
      name: "Caterers",
      image: "/api/placeholder/300/200",
      description: "Delicious food for your celebration"
    }
  ];

  const beautyServices = [
    {
      id: 1,
      name: "Beauty Parlours",
      image: "/api/placeholder/300/200",
      description: "Professional beauty treatments"
    },
    {
      id: 2,
      name: "Spa & Massages",
      image: "/api/placeholder/300/200",
      description: "Relaxing spa experiences"
    },
    {
      id: 3,
      name: "Salons",
      image: "/api/placeholder/300/200",
      description: "Hair styling and grooming"
    }
  ];

  const businesses = [
    {
      id: 1,
      name: "Royal Palace Banquet Hall",
      category: "Wedding Venues",
      rating: 4.5,
      reviews: 128,
      location: "Civil Lines, Betul",
      phone: "+91 98765 43210",
      timing: "9:00 AM - 11:00 PM",
      price: "₹15,000 - ₹25,000",
      image: "/api/placeholder/300/200",
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: "Glow Beauty Salon",
      category: "Beauty & Spa",
      rating: 4.3,
      reviews: 89,
      location: "Sarafa Bazaar, Betul",
      phone: "+91 98765 43211",
      timing: "10:00 AM - 8:00 PM",
      price: "₹500 - ₹2,000",
      image: "/api/placeholder/300/200",
      verified: true,
      featured: false
    },
    {
      id: 3,
      name: "Spice Garden Restaurant",
      category: "Restaurants",
      rating: 4.2,
      reviews: 156,
      location: "Main Market, Betul",
      phone: "+91 98765 43212",
      timing: "11:00 AM - 11:00 PM",
      price: "₹200 - ₹800",
      image: "/api/placeholder/300/200",
      verified: true,
      featured: true
    }
  ];

  const ServiceSection = ({ title, services }: { title: string; services: any[] }) => (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="jd-service-banner group cursor-pointer">
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">{service.name}</h3>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-[hsl(var(--promotion-bg))]">
      <div className="max-w-7xl mx-auto px-4">
        <ServiceSection title="Wedding Requisites" services={weddingServices} />
        <ServiceSection title="Beauty & Spa" services={beautyServices} />
        
        {/* Featured Businesses */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-6">Top Rated Businesses in Betul</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div key={business.id} className="jd-service-banner group">
                <div className="relative">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={business.image} 
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {business.featured && (
                    <Badge className="absolute top-2 left-2 bg-[hsl(var(--secondary))] text-white">
                      Featured
                    </Badge>
                  )}
                  
                  {business.verified && (
                    <Badge variant="outline" className="absolute top-2 right-2 bg-white">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))] text-lg">{business.name}</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm">{business.category}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{business.rating}</span>
                    </div>
                    <span className="text-[hsl(var(--muted-foreground))] text-sm">({business.reviews} reviews)</span>
                  </div>

                  <div className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{business.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{business.timing}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                    <div>
                      <span className="font-semibold text-[hsl(var(--primary))]">{business.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="jd-btn-primary">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;