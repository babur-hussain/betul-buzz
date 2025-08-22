import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedBusinesses />
      <SubscriptionPlans />
      <Footer />
    </div>
  );
};

export default Index;
