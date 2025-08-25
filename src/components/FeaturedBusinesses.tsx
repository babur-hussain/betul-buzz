const FeaturedBusinesses = () => {
  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Bills & Recharge Section */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                Bills & Recharge
                <span className="ml-3 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  📱 Bharat Connect
                </span>
              </h2>
              <p className="text-gray-600">Pay your bills & recharge instantly with Justdial</p>
              <button className="text-blue-600 text-sm font-medium mt-2">Explore More</button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: "📱", name: "Mobile", color: "bg-green-100 text-green-600" },
              { icon: "💡", name: "Electricity", color: "bg-yellow-100 text-yellow-600" },
              { icon: "📺", name: "DTH", color: "bg-gray-100 text-gray-600" },
              { icon: "💧", name: "Water", color: "bg-blue-100 text-blue-600" },
              { icon: "🔥", name: "Gas", color: "bg-red-100 text-red-600" },
              { icon: "🛡️", name: "Insurance", color: "bg-purple-100 text-purple-600" }
            ].map((item, index) => (
              <div key={index} className={`${item.color} rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Bookings Section */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Travel Bookings</h2>
              <p className="text-gray-600">Instant ticket bookings for your best travel experience</p>
              <button className="text-blue-600 text-sm font-medium mt-2">Explore More</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: "✈️", name: "Flight", subtitle: "Powered By Easemytrip.com", color: "bg-blue-100 text-blue-600" },
              { icon: "🚌", name: "Bus", subtitle: "Affordable Rides", color: "bg-green-100 text-green-600" },
              { icon: "🚆", name: "Train", subtitle: "", color: "bg-red-100 text-red-600" },
              { icon: "🏨", name: "Hotel", subtitle: "Budget-friendly Stay", color: "bg-orange-100 text-orange-600" },
              { icon: "🚗", name: "Car Rentals", subtitle: "Drive Easy Anywhere", color: "bg-gray-100 text-gray-600" }
            ].map((item, index) => (
              <div key={index} className={`${item.color} rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm font-bold mb-1">{item.name}</div>
                {item.subtitle && <div className="text-xs text-green-600">{item.subtitle}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Trending Searches Near You */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Searches Near You</h2>
            <span className="jd-badge ml-3">NEW</span>
          </div>
          <p className="text-gray-600 mb-6">Stay updated with the latest local trends.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop",
                title: "Night Clubs",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop",
                title: "Restaurants & Bars",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop",
                title: "Coffee Shops",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1554048612-b6a482b22681?w=400&h=200&fit=crop",
                title: "Photo Studios",
                action: "Explore >"
              }
            ].map((item, index) => (
              <div key={index} className="jd-card overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <button className="jd-explore-btn">{item.action}</button>
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