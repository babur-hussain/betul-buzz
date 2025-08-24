import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BusinessSearch from "@/components/business/BusinessSearch";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <BusinessSearch />
      <CategoriesSection />
      <FeaturedBusinesses />
      <SubscriptionPlans />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
