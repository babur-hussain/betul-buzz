import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Utensils, 
  Car, 
  Home, 
  Heart, 
  GraduationCap, 
  Scissors, 
  Wrench,
  TrendingUp,
  ArrowRight,
  Star,
  MapPin
} from "lucide-react";

const categories = [
  {
    icon: ShoppingBag,
    name: "Shopping & Retail",
    count: "2,400+",
    color: "from-blue-500 to-blue-600",
    businesses: ["Clothing", "Electronics", "Grocery"],
    popular: ["Big Bazaar", "Reliance Digital", "DMart"]
  },
  {
    icon: Utensils,
    name: "Food & Restaurants",
    count: "1,800+",
    color: "from-orange-500 to-red-500",
    businesses: ["Restaurants", "Cafes", "Sweet Shops"],
    popular: ["Pizza Hut", "KFC", "Domino's"]
  },
  {
    icon: Car,
    name: "Automotive",
    count: "950+",
    color: "from-gray-600 to-gray-700",
    businesses: ["Repairs", "Spare Parts", "Services"],
    popular: ["Maruti Service", "Honda Service", "Tata Motors"]
  },
  {
    icon: Home,
    name: "Home & Garden",
    count: "1,200+",
    color: "from-green-500 to-green-600",
    businesses: ["Furniture", "Decor", "Hardware"],
    popular: ["IKEA", "HomeTown", "Godrej"]
  },
  {
    icon: Heart,
    name: "Health & Medical",
    count: "650+",
    color: "from-red-500 to-pink-500",
    businesses: ["Doctors", "Clinics", "Pharmacy"],
    popular: ["Apollo Hospital", "Fortis", "Max Healthcare"]
  },
  {
    icon: GraduationCap,
    name: "Education",
    count: "480+",
    color: "from-purple-500 to-purple-600",
    businesses: ["Schools", "Coaching", "Libraries"],
    popular: ["Delhi Public School", "Allen Career", "FIITJEE"]
  },
  {
    icon: Scissors,
    name: "Beauty & Wellness",
    count: "720+",
    color: "from-pink-500 to-rose-500",
    businesses: ["Salons", "Spa", "Fitness"],
    popular: ["Lakme Salon", "Kaya Clinic", "Gold's Gym"]
  },
  {
    icon: Wrench,
    name: "Professional Services",
    count: "890+",
    color: "from-indigo-500 to-indigo-600",
    businesses: ["Legal", "Accounting", "Consulting"],
    popular: ["KPMG", "Deloitte", "EY"]
  }
];

const trendingSearches = [
  "Restaurants near me",
  "Best doctors in Betul",
  "Hotels with AC",
  "Car repair service",
  "Beauty salon appointment",
  "Gym membership deals",
  "Electrician emergency",
  "Plumber 24x7"
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Popular Categories
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Business <span className="text-gradient">Categories</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you're looking for from thousands of verified local businesses
          </p>
        </div>

        {/* Trending Searches */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
            🔥 Trending Searches
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-primary transition-all duration-200"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {category.name}
                </h3>
                
                <Badge variant="secondary" className="mb-3">
                  {category.count} businesses
                </Badge>
                
                <div className="text-sm text-muted-foreground mb-4">
                  {category.businesses.join(" • ")}
                </div>

                {/* Popular businesses */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Popular:</h4>
                  <div className="space-y-1">
                    {category.popular.slice(0, 2).map((business, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        {business}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Services Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Quick Services
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[
              { name: 'Emergency', icon: '🚨', color: 'bg-red-100 text-red-600' },
              { name: '24x7', icon: '⏰', color: 'bg-blue-100 text-blue-600' },
              { name: 'Home Service', icon: '🏠', color: 'bg-green-100 text-green-600' },
              { name: 'Online Booking', icon: '💻', color: 'bg-purple-100 text-purple-600' },
              { name: 'Verified', icon: '✅', color: 'bg-emerald-100 text-emerald-600' },
              { name: 'Best Rated', icon: '⭐', color: 'bg-yellow-100 text-yellow-600' },
            ].map((service, index) => (
              <div
                key={index}
                className={`${service.color} rounded-lg p-3 text-center cursor-pointer hover:scale-105 transition-transform duration-200`}
              >
                <div className="text-2xl mb-1">{service.icon}</div>
                <div className="text-xs font-medium">{service.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Can't find your category?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're constantly adding new business categories. Let us know what you're looking for!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-hero">
                Suggest a Category
              </button>
              <button className="px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300">
                View All Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;