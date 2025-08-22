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
  ArrowRight
} from "lucide-react";

const categories = [
  {
    icon: ShoppingBag,
    name: "Shopping & Retail",
    count: "2,400+",
    color: "from-blue-500 to-blue-600",
    businesses: ["Clothing", "Electronics", "Grocery"]
  },
  {
    icon: Utensils,
    name: "Food & Restaurants",
    count: "1,800+",
    color: "from-orange-500 to-red-500",
    businesses: ["Restaurants", "Cafes", "Sweet Shops"]
  },
  {
    icon: Car,
    name: "Automotive",
    count: "950+",
    color: "from-gray-600 to-gray-700",
    businesses: ["Repairs", "Spare Parts", "Services"]
  },
  {
    icon: Home,
    name: "Home & Garden",
    count: "1,200+",
    color: "from-green-500 to-green-600",
    businesses: ["Furniture", "Decor", "Hardware"]
  },
  {
    icon: Heart,
    name: "Health & Medical",
    count: "650+",
    color: "from-red-500 to-pink-500",
    businesses: ["Doctors", "Clinics", "Pharmacy"]
  },
  {
    icon: GraduationCap,
    name: "Education",
    count: "480+",
    color: "from-purple-500 to-purple-600",
    businesses: ["Schools", "Coaching", "Libraries"]
  },
  {
    icon: Scissors,
    name: "Beauty & Wellness",
    count: "720+",
    color: "from-pink-500 to-rose-500",
    businesses: ["Salons", "Spa", "Fitness"]
  },
  {
    icon: Wrench,
    name: "Professional Services",
    count: "890+",
    color: "from-indigo-500 to-indigo-600",
    businesses: ["Legal", "Accounting", "Consulting"]
  }
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
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

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="card-category group hover:scale-105 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
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
                
                <div className="flex items-center justify-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                  Explore <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
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