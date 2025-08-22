import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  TrendingUp,
  Users,
  BarChart,
  Phone
} from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "Forever",
    description: "Perfect for small local businesses getting started",
    icon: Users,
    color: "from-gray-500 to-gray-600",
    features: [
      "Business listing with basic info",
      "Contact details display",
      "Standard search visibility",
      "Customer reviews",
      "Basic analytics",
      "Mobile-friendly profile"
    ],
    limitations: [
      "No featured placement",
      "Limited photos (3 max)",
      "Basic support"
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Premium",
    price: "₹999",
    period: "per month",
    description: "Enhanced visibility and customer engagement tools",
    icon: Star,
    color: "from-primary to-blue-600",
    features: [
      "Everything in Basic",
      "Featured in category listings",
      "Unlimited photos & videos",
      "Priority search ranking",
      "Customer inquiry management",
      "Advanced analytics & insights",
      "Social media integration",
      "Custom business hours",
      "Promotional offers posting"
    ],
    limitations: [],
    cta: "Start Premium",
    popular: true
  },
  {
    name: "Featured",
    price: "₹1,999",
    period: "per month",
    description: "Maximum exposure with top placement across the platform",
    icon: Crown,
    color: "from-secondary to-red-600",
    features: [
      "Everything in Premium",
      "Homepage featured placement",
      "Top search results guaranteed",
      "Featured badge on all listings",
      "Priority customer support",
      "WhatsApp business integration",
      "Lead generation tools",
      "Competitor analysis",
      "Custom promotional campaigns",
      "Dedicated account manager"
    ],
    limitations: [],
    cta: "Go Featured",
    popular: false
  }
];

const SubscriptionPlans = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-featured/10 text-featured border-featured/20">
            <TrendingUp className="w-4 h-4 mr-2" />
            Business Plans
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="text-gradient">Growth Plan</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan to showcase your business and connect with more customers in Betul
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={index}
                className={`relative border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 badge-premium">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period !== "Forever" && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">Limitations:</p>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start space-x-2">
                          <span className="text-xs text-muted-foreground">• {limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4">
                  <Button 
                    className={`w-full py-3 ${
                      plan.popular 
                        ? 'btn-hero' 
                        : 'border border-primary text-primary hover:bg-primary hover:text-white'
                    } transition-all duration-300`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-soft">
            <BarChart className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">Performance Tracking</h4>
            <p className="text-sm text-muted-foreground">Monitor your business performance with detailed analytics</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-soft">
            <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">24/7 Support</h4>
            <p className="text-sm text-muted-foreground">Get help whenever you need it with our dedicated support team</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-soft">
            <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold text-foreground mb-2">Instant Activation</h4>
            <p className="text-sm text-muted-foreground">Your business listing goes live immediately after signup</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to grow your business?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful businesses already on BetulBuzz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-hero px-8 py-3">
                Start Free Trial
              </Button>
              <Button variant="outline" className="px-8 py-3">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;