"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionWrapper from "@/components/sessionWrapper";
import ToastProvider from "@/components/toastWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionWrapper>
        <main className="w-screen">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </SessionWrapper>
    </>
  );
}
