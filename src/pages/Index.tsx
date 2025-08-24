import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "BetulDial - Local Business Directory | Find Best Services in Betul";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedBusinesses />
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
