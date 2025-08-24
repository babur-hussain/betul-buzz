import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Star,
  Users,
  Building
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Stay Updated with BetulBuzz</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get the latest updates on new businesses, special offers, and local events in Betul
            </p>
          </div>
          
          <div className="max-w-md mx-auto flex space-x-4">
            <Input 
              placeholder="Enter your email"
              className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
            />
            <Button className="btn-hero">
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gradient">BetulBuzz</h2>
                <p className="text-sm text-gray-400">Find Local Businesses</p>
              </div>
            </div>
            
            <p className="text-gray-300">
              Connecting local businesses with customers in Betul. Discover, connect, and grow with the most trusted business directory in the city.
            </p>
            
            <div className="flex space-x-4">
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <Building className="w-6 h-6 mx-auto mb-1" />
                <div className="text-lg font-bold">10K+</div>
                <div className="text-xs text-gray-400">Businesses</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <Users className="w-6 h-6 mx-auto mb-1" />
                <div className="text-lg font-bold">50K+</div>
                <div className="text-xs text-gray-400">Users</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <Star className="w-6 h-6 mx-auto mb-1" />
                <div className="text-lg font-bold">4.8</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Browse Categories', 'Featured Businesses', 'Add Business', 'Pricing Plans', 'About Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Popular Categories</h3>
            <ul className="space-y-3">
              {['Restaurants', 'Shopping', 'Healthcare', 'Education', 'Automotive', 'Beauty & Wellness'].map((category) => (
                <li key={category}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 hover:opacity-100 transition-opacity" />
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-white">Betul, Madhya Pradesh</div>
                  <div className="text-gray-400 text-sm">India - 460001</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-white">+91 98765 43210</div>
                  <div className="text-gray-400 text-sm">Mon-Sat 9AM-6PM</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-white">hello@betulbuzz.com</div>
                  <div className="text-gray-400 text-sm">24/7 Email Support</div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 BetulBuzz. All rights reserved. Made with ❤️ for Betul businesses.
            </div>
            
            <div className="flex space-x-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Help Center'].map((link) => (
                <a key={link} href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;