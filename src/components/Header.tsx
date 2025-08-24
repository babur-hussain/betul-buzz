import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Download, User } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="bg-white border-b border-[hsl(var(--border))] shadow-sm">
      {/* Top Bar */}
      <div className="bg-[hsl(var(--muted))] py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6 text-[hsl(var(--muted-foreground))]">
            <span>Free Listing</span>
            <span>Advertise</span>
          </div>
          <div className="flex items-center gap-4 text-[hsl(var(--muted-foreground))]">
            <span>EN</span>
            <span>We are Hiring</span>
            <span>Investor Relations</span>
            <span>Leads</span>
            <span>Advertise</span>
            <span>Free Listing</span>
            <Button size="sm" className="jd-btn-primary">
              Login / Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-[hsl(var(--primary))] text-2xl font-bold">BetulDial</span>
          </Link>

          {/* Search Section */}
          <div className="flex-1 max-w-3xl mx-8">
            <div className="text-center mb-4">
              <h1 className="text-xl font-medium text-[hsl(var(--foreground))]">
                Search across <span className="text-[hsl(var(--primary))]">'4.7 Crore+'</span>{' '}
                <span className="text-[hsl(var(--primary))]">Businesses</span>
              </h1>
            </div>
            
            <div className="flex gap-2">
              {/* Location Input */}
              <div className="jd-search-box flex items-center px-4 py-3 min-w-[200px]">
                <MapPin className="w-5 h-5 text-[hsl(var(--muted-foreground))] mr-2" />
                <input
                  type="text"
                  placeholder="Betul"
                  className="flex-1 outline-none text-[hsl(var(--foreground))]"
                  value="Betul"
                  readOnly
                />
              </div>

              {/* Search Input */}
              <div className="jd-search-box flex items-center px-4 py-3 flex-1">
                <input
                  type="text"
                  placeholder="Search for Restaurants, Hotels, Beauty Spa..."
                  className="flex-1 outline-none text-[hsl(var(--foreground))]"
                />
                <Search className="w-5 h-5 text-[hsl(var(--muted-foreground))] ml-2" />
              </div>

              {/* Search Button */}
              <Button className="jd-btn-secondary px-8">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Download App */}
          <div className="flex items-center gap-2 text-[hsl(var(--primary))] border border-[hsl(var(--primary))] rounded-lg px-4 py-2">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download App</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;