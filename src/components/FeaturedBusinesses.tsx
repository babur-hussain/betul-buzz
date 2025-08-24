import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  Award,
  TrendingUp,
  ArrowRight
} from "lucide-react";

const featuredBusinesses = [
  {
    id: 1,
    name: "Betul Central Restaurant",
    category: "Restaurant",
    rating: 4.8,
    reviews: 127,
    location: "Betul, MP",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    features: ["24/7 Service", "Home Delivery", "Vegetarian Options"],
    verified: true,
    premium: true,
    phone: "+91 98765 43210",
    hours: "9:00 AM - 11:00 PM"
  },
  {
    id: 2,
    name: "Dr. Sharma's Dental Clinic",
    category: "Healthcare",
    rating: 4.9,
    reviews: 89,
    location: "Betul, MP",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop",
    features: ["Emergency Care", "Modern Equipment", "Insurance Accepted"],
    verified: true,
    premium: false,
    phone: "+91 98765 43211",
    hours: "10:00 AM - 7:00 PM"
  },
  {
    id: 3,
    name: "Betul Auto Service Center",
    category: "Automotive",
    rating: 4.7,
    reviews: 156,
    location: "Betul, MP",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
    features: ["24/7 Towing", "Genuine Parts", "Warranty"],
    verified: true,
    premium: true,
    phone: "+91 98765 43212",
    hours: "8:00 AM - 8:00 PM"
  },
  {
    id: 4,
    name: "Beauty & Beyond Salon",
    category: "Beauty & Wellness",
    rating: 4.6,
    reviews: 203,
    location: "Betul, MP",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
    features: ["Professional Staff", "Premium Products", "Online Booking"],
    verified: true,
    premium: false,
    phone: "+91 98765 43213",
    hours: "9:00 AM - 9:00 PM"
  },
  {
    id: 5,
    name: "Betul Electronics Store",
    category: "Electronics",
    rating: 4.8,
    reviews: 94,
    location: "Betul, MP",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    features: ["Authorized Dealer", "Installation Service", "Extended Warranty"],
    verified: true,
    premium: true,
    phone: "+91 98765 43214",
    hours: "10:00 AM - 8:00 PM"
  },
  {
    id: 6,
    name: "Fitness First Gym",
    category: "Fitness",
    rating: 4.9,
    reviews: 67,
    location: "Betul, MP",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    features: ["Personal Training", "Group Classes", "24/7 Access"],
    verified: true,
    premium: true,
    phone: "+91 98765 43215",
    hours: "5:00 AM - 11:00 PM"
  }
];

const FeaturedBusinesses = () => {
  return (
    <section id="featured" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Featured Businesses
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Top Rated <span className="text-gradient">Businesses</span> in Betul
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most trusted and highly-rated local businesses in your area
          </p>
        </div>

        {/* Featured Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredBusinesses.map((business) => (
            <div key={business.id} className="group">
              {/* Business Card */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={business.image}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {business.verified && (
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                    {business.premium && (
                      <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        Premium
                      </div>
                    )}
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-semibold text-gray-900">{business.rating}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{business.category}</p>
                  </div>
                  
                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-foreground font-semibold ml-1">{business.rating}</span>
                        <span className="text-muted-foreground text-sm ml-1">({business.reviews} reviews)</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{business.location}</span>
                  </div>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {business.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {business.features.length > 2 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          +{business.features.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{business.hours}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to be featured here?
            </h3>
            <p className="text-muted-foreground mb-6">
              Boost your business visibility and reach more customers with our premium listing options
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                List Your Business
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="px-6 py-3 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                View All Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;