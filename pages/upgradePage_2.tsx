import React from "react";
import { PricingCard } from "@/components/pricingCard_2";
import { PricingHeader } from "@/components/pricingHeader_2";

const UpgradePage = ({ session, status }: any) => {
  const plans = [
    {
      name: "Free",
      price: "Free",
      description: "Perfect for casual users and trying out the service",
      scanLimit: "5 scans per month",
      features: [
        { text: "Basic ingredient analysis", included: true },
        { text: "Common allergen detection", included: true },
        { text: "Scan history (30 days)", included: true },
        { text: "Community support", included: true },
        { text: "Advanced health insights", included: false },
        { text: "Custom dietary preferences", included: false },
        // { text: "API access", included: false },
      ],
      ctaText: "continue",
    },
    {
      name: "Pro",
      price: "$2.00",
      description: "Ideal for health-conscious individuals and families",
      scanLimit: "Unlimited scans",
      features: [
        { text: "Basic ingredient analysis", included: true },
        { text: "Advanced health insights", included: true },
        { text: "Custom dietary preferences", included: true },
        { text: "Detailed nutritional analysis", included: true },
        { text: "Priority support", included: true },
        { text: "Scan history (unlimited)", included: true },
        // { text: "API access", included: false },
      ],
      ctaText: "Get Started",
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <PricingHeader />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
              session={session}
              status={status}
            />
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <p className="text-gray-600">
            Need a custom plan or have questions?{" "}
            <a
              href="#"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Contact our sales team
            </a>
          </p>
          <p className="text-sm text-gray-500">
            All plans include a 14-day money-back guarantee. No credit card
            required for free tier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
