import React from 'react';
import { PricingCard } from '@/components/pricingCard';
import { Zap } from 'lucide-react';

export function UpgradePage() {
  const plans = [
    {
      name: "Free",
      price: "Free",
      description: "Perfect for side projects and small teams",
      features: [
        { text: "Up to 3 projects", included: true },
        { text: "Basic analytics", included: true },
        { text: "24-hour support response time", included: true },
        { text: "Community access", included: true },
        { text: "Custom domains", included: false },
        { text: "Advanced security", included: false },
      ],
    },
    {
      name: "Pro",
      price: "$29",
      description: "Everything you need for a growing business",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Advanced analytics", included: true },
        { text: "4-hour support response time", included: true },
        { text: "Community access", included: true },
        { text: "Custom domains", included: true },
        { text: "Advanced security", included: true },
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "Advanced features for larger organizations",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Advanced analytics & reporting", included: true },
        { text: "1-hour support response time", included: true },
        { text: "Priority community access", included: true },
        { text: "Multiple custom domains", included: true },
        { text: "Enterprise-grade security", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with our flexible pricing options. Cancel anytime.
            All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need a custom plan? {" "}
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}