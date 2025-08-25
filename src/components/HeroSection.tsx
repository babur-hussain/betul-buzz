import { Badge } from "@/components/ui/badge";

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Promotional Banner/Carousel - Main JD Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Large Promotional Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-8 h-64 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-orange-800 mb-2">गणेश चतुर्थी</h2>
                <p className="text-orange-700 mb-4">Find Ganesh Murti, Sweets & more</p>
                <button className="bg-orange-800 text-white px-6 py-2 rounded font-semibold">
                  Explore Now
                </button>
              </div>
              <div className="absolute right-4 top-4 w-32 h-32 bg-orange-200 rounded-full opacity-50"></div>
              <div className="absolute bottom-0 right-0 text-6xl opacity-20">🕉️</div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="font-bold mb-1">B2B</h3>
              <p className="text-sm mb-2">Quick Quotes</p>
              <button className="text-xs bg-white text-blue-600 px-3 py-1 rounded">Explore</button>
            </div>
            
            <div className="bg-gray-700 text-white rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-bold mb-1">REPAIRS &</h3>
              <h3 className="font-bold mb-1">SERVICES</h3>
              <p className="text-sm mb-2">Get Nearest Vendor</p>
            </div>
            
            <div className="bg-purple-600 text-white rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">🏢</div>
              <h3 className="font-bold mb-1">REAL ESTATE</h3>
              <p className="text-sm mb-2">Finest Agents</p>
            </div>
            
            <div className="bg-green-600 text-white rounded-lg p-6 text-center">
              <div className="text-3xl mb-2">👨‍⚕️</div>
              <h3 className="font-bold mb-1">DOCTORS</h3>
              <p className="text-sm mb-2">Book Now</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-4 mb-8">
          {[
            { icon: "🍽️", name: "Restaurants", count: "" },
            { icon: "🏨", name: "Hotels", count: "" },
            { icon: "💄", name: "Beauty Spa", count: "" },
            { icon: "🏠", name: "Home Decor", count: "" },
            { icon: "💒", name: "Wedding Planning", count: "❤️" },
            { icon: "🎓", name: "Education", count: "" },
            { icon: "🏡", name: "Rent & Hire", count: "" },
            { icon: "🏥", name: "Hospital", count: "" },
            { icon: "🛒", name: "Contractors", count: "" },
            { icon: "📱", name: "Popular Categories", count: "≡" }
          ].map((category, index) => (
            <div key={index} className="jd-category-card">
              <div className="text-3xl mb-2 relative">
                {category.icon}
                {category.count && (
                  <span className="absolute -top-1 -right-1 text-xs">{category.count}</span>
                )}
              </div>
              <p className="text-xs font-medium text-gray-700">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;