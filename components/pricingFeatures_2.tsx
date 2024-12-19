import React from 'react';
import { Check, X } from 'lucide-react';

interface PricingFeatureProps {
  text: string;
  included: boolean;
  highlighted?: boolean;
}

export function PricingFeature({ text, included, highlighted = false }: PricingFeatureProps) {
  const Icon = included ? Check : X;
  
  return (
    <li className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${
        highlighted 
          ? included ? 'text-blue-100' : 'text-blue-300/50'
          : included ? 'text-blue-600' : 'text-gray-300'
      }`} />
      <span className={`${
        highlighted
          ? included ? 'text-white' : 'text-blue-100/70'
          : included ? 'text-gray-900' : 'text-gray-500'
      }`}>
        {text}
      </span>
    </li>
  );
}