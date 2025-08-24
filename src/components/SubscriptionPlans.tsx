import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Star, 
  TrendingUp, 
  Award,
  Crown,
  Zap,
  Shield,
  Users,
  MapPin,
  Phone,
  Globe
} from "lucide-react";

const plans = [
  {
    name: "Basic Listing",
    price: "Free",
    period: "Forever",
    description: "Perfect for small businesses getting started",
    features: [
      "Basic business profile",
      "Contact information",
      "Business hours",
      "Category listing",
      "Basic search visibility"
    ],
    popular: false,
    icon: MapPin,
    color: "from-gray-500 to-gray-600"
  },
  {
    name: "Premium Listing",
    price: "₹999",
    period: "per month",
    description: "Most popular choice for growing businesses",
    features: [
      "Everything in Basic",
      "Priority search ranking",
      "Business photos (up to 10)",
      "Customer reviews",
      "Social media links",
      "Business description",
      "Special offers section",
      "Analytics dashboard"
    ],
    popular: true,
    icon: Star,
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "Featured Business",
    price: "₹1,999",
    period: "per month",
    description: "Maximum visibility for established businesses",
    features: [
      "Everything in Premium",
      "Top search results",
      "Featured section placement",
      "Business videos",
      "Advanced analytics",
      "Customer insights",
      "Priority support",
      "Custom branding",
      "Lead generation tools",
      "Competitor analysis"
    ],
    popular: false,
    icon: Crown,
    color: "from-purple-500 to-pink-500"
  }
];

const benefits = [
  {
    icon: Users,
    title: "Reach More Customers",
    description: "Get discovered by thousands of local customers searching for your services"
  },
  {
    icon: TrendingUp,
    title: "Boost Your Business",
    description: "Increase foot traffic and online visibility with our proven platform"
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    description: "Join thousands of verified businesses trusted by the Betul community"
  },
  {
    icon: Globe,
    title: "Local SEO Benefits",
    description: "Improve your local search rankings and Google Maps visibility"
  }
];

const SubscriptionPlans = () => {
  return (
    <section id="plans" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Award className="w-4 h-4 mr-2" />
            Business Plans
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="text-gradient">Business Plan</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan to boost your business visibility and reach more customers in Betul
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div key={index} className={`relative ${plan.popular ? 'scale-105' : ''}`}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-2">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan Card */}
                <div className={`bg-white rounded-2xl border-2 ${plan.popular ? 'border-primary shadow-xl' : 'border-gray-200'} p-8 h-full`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      {plan.period !== "Forever" && (
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${plan.popular ? 'btn-hero' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    size="lg"
                  >
                    {plan.price === "Free" ? "Get Started" : "Choose Plan"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            All Plans Include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Easy Setup</h4>
              <p className="text-muted-foreground text-sm">
                Get your business listed in minutes with our simple setup process
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Verified Badge</h4>
              <p className="text-muted-foreground text-sm">
                Build trust with customers through our verification system
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">24/7 Support</h4>
              <p className="text-muted-foreground text-sm">
                Get help whenever you need it with our dedicated support team
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to grow your business?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful businesses already using BetulBuzz to reach more customers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero">
                Start Free Trial
              </Button>
              <Button variant="outline" className="px-6 py-3 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;