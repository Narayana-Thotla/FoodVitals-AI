import React from 'react';
import { ScanSearch } from 'lucide-react';

export function PricingHeader() {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center mb-4">
        {/* <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl"> */}
          {/* <ScanSearch className="h-10 w-10 text-white" /> */}
        {/* </div> */}
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Choose Your Scanning Plan
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Unlock the power of AI-powered ingredient analysis. Start with our free tier
        or upgrade for advanced features and unlimited scans.
      </p>
    </div>
  );
}