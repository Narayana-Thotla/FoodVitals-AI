// 'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodVitals-AI",
  description:
    "FoodVitals AI empowers you to explore healthy products, scan food barcodes, and discover nutritional facts with ease. Analyze ingredients, gain AI-powered insights, and make informed choices for better health. With a focus on food transparency and wellness tracking, our smart food scanner helps you prioritize your health like never before. Healthy living starts here—because your health is our priority!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
