const Footer = () => {
  return (
    <footer className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* Rainy Day Essentials */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold">Rainy Day Essentials</h2>
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded ml-3">SEASONAL</span>
          </div>
          <p className="text-gray-600 mb-6">Discover wide range of rainy collection</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
                title: "General Physician Doctors",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop",
                title: "Plumbing Contractors",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=200&fit=crop",
                title: "Pest Control Services For...",
                action: "Explore >"
              },
              { 
                image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=200&fit=crop",
                title: "Zip Lock Bag Dealers",
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

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="jd-card overflow-hidden">
              <div className="flex items-center p-4 border-b">
                <span className="text-2xl mr-3">📱</span>
                <div>
                  <h3 className="font-bold">Vi Prepaid (Customer...)</h3>
                  <div className="flex items-center mt-1">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">WhatsApp</span>
                  </div>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop" alt="Vi Prepaid" className="w-full h-32 object-cover" />
            </div>

            <div className="jd-card overflow-hidden">
              <div className="flex items-center p-4 border-b">
                <div>
                  <h3 className="font-bold">The Taj Mahal Palace</h3>
                  <p className="text-gray-600 text-sm">Apollo Bunder - Mumbai</p>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=200&fit=crop" alt="Taj Mahal Palace" className="w-full h-32 object-cover" />
            </div>

            <div className="jd-card overflow-hidden">
              <div className="flex items-center p-4 border-b">
                <div>
                  <h3 className="font-bold">Money View (Customer Care)</h3>
                  <p className="text-gray-600 text-sm">Fort - Mumbai</p>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop" alt="Money View" className="w-full h-32 object-cover" />
            </div>
          </div>
        </div>

        {/* Connect Popup */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white rounded-lg p-4 max-w-sm shadow-lg">
            <button className="absolute top-2 right-2 text-white text-xl">&times;</button>
            <h3 className="font-bold text-lg mb-2">Connect with 19.3 Crore+ Buyers</h3>
            <p className="text-sm mb-3">Grow Your Business in 3 Easy Steps</p>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded font-bold w-full">
              List your Business for FREE
            </button>
            <div className="mt-3 flex items-center">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" alt="User" className="w-10 h-10 rounded-full mr-3" />
              <div className="text-xs">
                <div>📱 Show App Features</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <button className="bg-gray-600 text-white rounded-full p-3 shadow-lg hover:bg-gray-700 transition-colors">
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;