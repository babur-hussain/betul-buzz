import React from 'react';
import { ArrowRight, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  const quickLinks = [
    "About Us", "Contact Us", "Careers", "Terms & Conditions", 
    "Privacy Policy", "Feedback", "Report a Bug"
  ];

  const categories = [
    "Restaurants", "Hotels", "Beauty Spa", "Home Decor", 
    "Wedding Planning", "Education", "Healthcare", "Real Estate"
  ];

  const cities = [
    "Betul", "Bhopal", "Indore", "Jabalpur", 
    "Gwalior", "Ujjain", "Sagar", "Dewas"
  ];

  return (
    <footer className="bg-[hsl(var(--foreground))] text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated with BetulDial</h2>
          <p className="text-blue-100 mb-6">Get the latest updates on businesses, offers, and services in Betul</p>
          <div className="flex justify-center">
            <div className="flex max-w-md w-full">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-l-lg text-[hsl(var(--foreground))] outline-none"
              />
              <Button className="bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary-hover))] text-white px-6 rounded-l-none">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-6">BetulDial</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <span className="text-gray-300">Betul, Madhya Pradesh, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <span className="text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[hsl(var(--primary))]" />
                  <span className="text-gray-300">info@betuldial.com</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex gap-4 text-sm text-gray-300 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-lg text-white">1000+</div>
                    <div>Businesses</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-white">50K+</div>
                    <div>Users</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-white">4.5</div>
                    <div>Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-[hsl(var(--primary))] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Popular Categories</h4>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-[hsl(var(--primary))] transition-colors"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cities */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Other Cities</h4>
              <ul className="space-y-3">
                {cities.map((city, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-[hsl(var(--primary))] transition-colors"
                    >
                      {city}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <div className="flex justify-center gap-6 mb-6">
              <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4 text-center text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2024 BetulDial. All rights reserved. | Privacy Policy | Terms of Service | Sitemap</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;