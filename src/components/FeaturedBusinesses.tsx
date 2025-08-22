import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  TrendingUp,
  Award,
  Eye,
  Heart
} from "lucide-react";

const featuredBusinesses = [
  {
    id: 1,
    name: "Royal Restaurant",
    category: "Restaurant",
    rating: 4.8,
    reviews: 245,
    address: "Civil Lines, Betul",
    phone: "+91 98765 43210",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    isPremium: true,
    isOpen: true,
    offers: ["Free Delivery", "20% Off"]
  },
  {
    id: 2,
    name: "TechZone Electronics",
    category: "Electronics",
    rating: 4.7,
    reviews: 189,
    address: "Sarafa Bazaar, Betul",
    phone: "+91 98765 43211",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    isPremium: true,
    isOpen: true,
    offers: ["Best Prices", "1 Year Warranty"]
  },
  {
    id: 3,
    name: "Green Valley Clinic",
    category: "Healthcare",
    rating: 4.9,
    reviews: 156,
    address: "Hospital Road, Betul",
    phone: "+91 98765 43212",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    isPremium: true,
    isOpen: true,
    offers: ["24/7 Service", "Free Consultation"]
  },
  {
    id: 4,
    name: "Style Studio",
    category: "Beauty Salon",
    rating: 4.6,
    reviews: 98,
    address: "New Market, Betul",
    phone: "+91 98765 43213",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    isPremium: false,
    isOpen: false,
    offers: ["Special Packages"]
  }
];

const FeaturedBusinesses = () => {
  return (
    <section id="businesses" className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
            <Award className="w-4 h-4 mr-2" />
            Featured Businesses
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Top Rated <span className="text-gradient">Local Businesses</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover highly-rated businesses that are loved by the Betul community
          </p>
        </div>

        {/* Featured Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredBusinesses.map((business) => (
            <Card key={business.id} className="card-business group">
              <div className="relative">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Premium Badge */}
                {business.isPremium && (
                  <Badge className="absolute top-3 left-3 badge-premium">
                    <Award className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}

                {/* Status Badge */}
                <Badge 
                  className={`absolute top-3 right-3 ${
                    business.isOpen 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {business.isOpen ? 'Open' : 'Closed'}
                </Badge>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-3">
                    <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {business.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {business.category}
                    </Badge>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{business.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({business.reviews} reviews)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {business.address}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-2 mb-4">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {business.phone}
                  </span>
                </div>

                {/* Offers */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {business.offers.map((offer, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {offer}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 btn-hero text-sm py-2">
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-sm py-2">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button className="btn-hero px-8 py-3">
            <TrendingUp className="w-5 h-5 mr-2" />
            View All Featured Businesses
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;