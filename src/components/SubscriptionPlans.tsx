const SubscriptionPlans = () => {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Latest Movies & Review Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Latest Movies & Review</h2>
            <button className="text-blue-600 hover:underline">View All &gt;</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 overflow-x-auto">
            {[
              { 
                image: "https://images.unsplash.com/photo-1489599735734-79b4169f2a78?w=300&h=400&fit=crop",
                title: "WAR 2",
                rating: "4.6/5"
              },
              { 
                image: "https://images.unsplash.com/photo-1518604666860-f6c5e2fa2daf?w=300&h=400&fit=crop",
                title: "NARSIMHA",
                rating: "90%"
              },
              { 
                image: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=300&h=400&fit=crop",
                title: "New Release",
                rating: "68%",
                action: "Book Now"
              },
              { 
                image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&h=400&fit=crop",
                title: "Comedy Special",
                rating: "85%"
              },
              { 
                image: "https://images.unsplash.com/photo-1615564470003-9bf17c2e1f92?w=300&h=400&fit=crop",
                title: "SAHAABA",
                rating: "4.7/5"
              }
            ].map((movie, index) => (
              <div key={index} className="jd-card overflow-hidden">
                <div className="relative">
                  <img src={movie.image} alt={movie.title} className="w-full h-64 object-cover" />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {movie.rating}
                  </div>
                  {movie.action && (
                    <div className="absolute bottom-2 right-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                        {movie.action}
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{movie.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Top Tourist Places */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold">Explore Top Tourist Places</h2>
            <span className="jd-badge ml-3">NEW</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=200&fit=crop",
                title: "Mumbai",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=200&fit=crop",
                title: "Pune",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=200&fit=crop",
                title: "Nashik",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=200&fit=crop",
                title: "Ahmedabad",
                action: "Explore >"
              }
            ].map((place, index) => (
              <div key={index} className="jd-card overflow-hidden">
                <img src={place.image} alt={place.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{place.title}</h3>
                  <button className="jd-explore-btn">{place.action}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { 
                image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
                title: "Estate Agents For Residential Rental",
                action: "Enquire Now"
              },
              { 
                image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=200&fit=crop",
                title: "Estate Agents For Residence",
                action: "Enquire Now"
              },
              { 
                image: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?w=400&h=200&fit=crop",
                title: "Interior Designers",
                action: "Enquire Now"
              },
              { 
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop",
                title: "Real Estate Agents",
                action: "Enquire Now"
              },
              { 
                image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=200&fit=crop",
                title: "Banquet Halls",
                action: "Enquire Now"
              }
            ].map((search, index) => (
              <div key={index} className="jd-card overflow-hidden">
                <img src={search.image} alt={search.title} className="w-full h-32 object-cover" />
                <div className="p-4 bg-blue-600 text-white">
                  <h3 className="font-bold text-sm mb-2">{search.title}</h3>
                  <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
                    {search.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;