'use client'
import React from 'react';
import { Check } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  highlighted?: boolean;
  ctaText?: string;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  ctaText = "Get Started"
}: PricingCardProps) {
  return (
    <div className={`rounded-2xl p-8 ${
      highlighted 
        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl transform scale-105' 
        : 'bg-white text-gray-900 shadow-lg'
    }`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className={`${highlighted ? 'text-blue-100' : 'text-gray-500'} text-sm`}>
          {description}
        </p>
      </div>
      
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Free' && <span className={`${highlighted ? 'text-blue-100' : 'text-gray-500'}`}>/month</span>}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <Check className={`h-5 w-5 ${
              highlighted 
                ? feature.included ? 'text-blue-100' : 'text-blue-300'
                : feature.included ? 'text-blue-600' : 'text-gray-300'
            }`} />
            <span className={`${
              highlighted
                ? feature.included ? 'text-white' : 'text-blue-100'
                : feature.included ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
        highlighted
          ? 'bg-white text-blue-600 hover:bg-blue-50'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}>
        {ctaText}
      </button>
    </div>
  );
}