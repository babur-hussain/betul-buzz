import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const SubscriptionPlans = () => {
  const plans = [
    {
      id: 1,
      name: "Free Listing",
      icon: Star,
      price: "₹0",
      period: "/month",
      description: "Get started with basic listing",
      features: [
        "Basic business listing",
        "Contact information display",
        "Business hours",
        "1 photo upload",
        "Customer reviews"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      id: 2,
      name: "Premium",
      icon: Zap,
      price: "₹999",
      period: "/month",
      description: "Enhanced visibility and features",
      features: [
        "Everything in Free",
        "Priority listing",
        "Up to 10 photos",
        "Business verification badge",
        "Customer inquiry management",
        "Basic analytics",
        "Social media links"
      ],
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      id: 3,
      name: "Featured",
      icon: Crown,
      price: "₹2,499",
      period: "/month",
      description: "Maximum exposure and growth",
      features: [
        "Everything in Premium",
        "Featured in search results",
        "Homepage banner placement",
        "Unlimited photos & videos",
        "Advanced analytics",
        "Lead generation tools",
        "24/7 priority support",
        "Social media promotion"
      ],
      buttonText: "Go Premium",
      buttonVariant: "default" as const,
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">
            Choose Your Business Plan
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mx-auto">
            Select the perfect plan to showcase your business and reach more customers in Betul
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                className={`jd-service-banner relative ${
                  plan.popular ? 'ring-2 ring-[hsl(var(--primary))]' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(var(--primary))] text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--primary))] bg-opacity-10 mb-4">
                      <IconComponent className="w-8 h-8 text-[hsl(var(--primary))]" />
                    </div>
                    <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">{plan.name}</h3>
                    <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4">{plan.description}</p>
                    
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-[hsl(var(--foreground))]">{plan.price}</span>
                      <span className="text-[hsl(var(--muted-foreground))] ml-1">{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-[hsl(var(--accent))] flex-shrink-0" />
                        <span className="text-[hsl(var(--foreground))] text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${plan.buttonVariant === 'default' ? 'jd-btn-primary' : ''}`}
                    variant={plan.buttonVariant}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-[hsl(var(--muted-foreground))] mb-4">
            Need a custom solution for your business?
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;