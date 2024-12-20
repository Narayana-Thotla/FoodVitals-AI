'use client'
import React from "react";
import { PricingFeature } from "./pricingFeatures_2";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Feature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: Feature[];
  highlighted?: boolean;
  ctaText?: string;
  scanLimit?: string;
  session: any; // Add session as part of the props
  status: any;
}

export function PricingCard({
  name,
  price,
  period = "month",
  description,
  features,
  highlighted = true,
  ctaText = "Get Started",
  scanLimit,
  session,
  status,
}: PricingCardProps) {
  // const { data: session, status } = useSession();
  const [email, setemail] = useState("");
  const [loading, setloading] = useState(false);

  const router = useRouter();

  const onSubscribe = async () => {
    try {
      setloading(true);
      // console.log("email in upgrade-pricing card-2:", email);
      const res = await fetch(`/api/stripe/${email}`);
      const data = await res.json();
      // console.log(res,data)
      const stripeUrl = await JSON.parse(data.url);
      // console.log(stripeUrl)
      window.location.href = stripeUrl;
      // console.log(window.location.href);
    } catch (error: any) {
      console.log("errror in upgradepage_2:", error.message);
    } finally {
      setloading(false);
    }
  };

  const goToScanPage = () => {
    router.push("/scan");
  };

  useEffect(() => {
    if (status == "loading") {
      return;
    }
    if (status == "authenticated") {
      setemail(session?.user?.email || "");
    }
  }, [status, session]);

  return (
    <div
      className={`rounded-2xl p-8 ${
        highlighted
          ? "bg-gradient-to-br from-slate-300 to-slate-600 text-white shadow-xl transform scale-105"
          : "bg-white text-gray-900 shadow-lg"
        // ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl transform scale-105'
        // : 'bg-white text-gray-900 shadow-lg'
      }`}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p
          className={`${
            highlighted ? "text-blue-100" : "text-gray-500"
          } text-sm`}
        >
          {description}
        </p>
      </div>

      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Free" && (
          <span
            className={`${highlighted ? "text-blue-100" : "text-gray-500"}`}
          >
            /{period}
          </span>
        )}
      </div>

      {scanLimit && (
        <div
          className={`mb-6 text-sm ${
            highlighted ? "text-blue-100" : "text-gray-600"
          }`}
        >
          {scanLimit}
        </div>
      )}

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <PricingFeature
            key={index}
            text={feature.text}
            included={feature.included}
            highlighted={highlighted}
          />
        ))}
      </ul>

      <button
        onClick={name === "Pro" ? onSubscribe : goToScanPage}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all hover:scale-90 ${
          highlighted
            ? "bg-white text-blue-600 hover:bg-blue-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {ctaText}
      </button>
    </div>
  );
}
