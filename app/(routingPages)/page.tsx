"use client";
import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Login_Buttons from "@/components/loginButtons";
import { redirect, useRouter } from "next/navigation";
import foodvidtal_pic from "@/public/FoodVitals_AI_Logo.jpg";
import Typewriter from "typewriter-effect";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log("session inside loginpage:", session);

  useEffect(() => {
    if (session) {
      router.push("/scan");
    }
  }, []);

  if (session) {
    router.push("/scan");
  }

  return (
    <>
      <div className="text-white h-screen">
        <div className="font-bold  text-4xl mt-10 text-slate-800 text-center">
          FoodVitals-AI
        </div>
        <div className="font-bold text-3xl text-center mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300  to-green-500 ">
          <Typewriter
            options={{
              strings: [
                "Explore Healthy Products",
                "Scan Food Barcodes",
                "Discover Nutritional Facts",
                "Analyze Ingredients",
                "Improve Your Health",
                "AI-Powered Insights",
                "Track Your Wellness",
                "Make Informed Choices",
                "Food Transparency",
                "Your Health, Our Priority",
                "Scan and Discover",
                "Healthy Living Starts Here",
                "FoodVitals AI",
                "Smart Food Scanner",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
        <div className="text-center mt-10 text-3xl w-[40vw] mx-auto  text-slate-700 bg-slate-200/40 backdrop-filter backdrop-blur-lg shadow-lg rounded-lg p-6">
          {" "}
          Login to your Account
          <div className="flex justify-center">
            <Login_Buttons />
          </div>
        </div>
      </div>
    </>
  );
}
