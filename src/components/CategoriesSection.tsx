import React from 'react';
import { 
  Utensils, 
  Building2, 
  Sparkles, 
  Home, 
  Heart, 
  GraduationCap, 
  Car, 
  Hospital,
  HardHat,
  PawPrint,
  Bed,
  Users,
  Stethoscope,
  Dumbbell,
  CreditCard,
  Calendar,
  School,
  Truck,
  UserCheck,
  MoreHorizontal
} from 'lucide-react';

const CategoriesSection = () => {
  const categories = [
    { name: 'Restaurants', icon: Utensils, color: 'text-orange-600' },
    { name: 'Hotels', icon: Building2, color: 'text-blue-600' },
    { name: 'Beauty Spa', icon: Sparkles, color: 'text-pink-600' },
    { name: 'Home Decor', icon: Home, color: 'text-green-600' },
    { name: 'Wedding Planning', icon: Heart, color: 'text-red-600' },
    { name: 'Education', icon: GraduationCap, color: 'text-purple-600' },
    { name: 'Rent & Hire', icon: Car, color: 'text-indigo-600' },
    { name: 'Hospitals', icon: Hospital, color: 'text-teal-600' },
    { name: 'Contractors', icon: HardHat, color: 'text-amber-600' },
    { name: 'Pet Shops', icon: PawPrint, color: 'text-brown-600' },
    { name: 'PG/Hostels', icon: Bed, color: 'text-gray-600' },
    { name: 'Estate Agent', icon: Users, color: 'text-slate-600' },
    { name: 'Dentists', icon: Stethoscope, color: 'text-cyan-600' },
    { name: 'Gym', icon: Dumbbell, color: 'text-orange-700' },
    { name: 'Loans', icon: CreditCard, color: 'text-green-700' },
    { name: 'Event Organisers', icon: Calendar, color: 'text-violet-600' },
    { name: 'Driving Schools', icon: School, color: 'text-blue-700' },
    { name: 'Packers & Movers', icon: Truck, color: 'text-red-700' },
    { name: 'Courier Service', icon: UserCheck, color: 'text-emerald-600' },
    { name: 'Popular Categories', icon: MoreHorizontal, color: 'text-gray-700' }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="jd-category-card group"
              >
                <div className="flex flex-col items-center">
                  <div className={`mb-3 p-3 rounded-full bg-gray-50 group-hover:bg-[hsl(var(--category-hover))] transition-colors`}>
                    <IconComponent className={`w-8 h-8 ${category.color}`} />
                  </div>
                  <span className="text-xs text-center text-[hsl(var(--foreground))] font-medium leading-tight">
                    {category.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;