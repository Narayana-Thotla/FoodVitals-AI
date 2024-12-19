"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import Navbar_2 from "@/components/Navbar";
import Navbar_2 from "@/components/Navbar_2";
import Footer from "@/components/Footer";
import { useSession, signIn, signOut } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-Sidebar";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setcount] = useState();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const countApi = async () => {
      try {
        const countValue = await fetch(
          `/api/apilimit/checkapilimit/${session?.user?.email}`
        );
        const countNum = await countValue.json();
        setcount(countNum.count);
        console.log("countNumber inside appsidebar:", countNum);
      } catch (error) {}
    };
    if (status === "authenticated" && session) {
      countApi();
    }
  }, [session, status]);

  useEffect(() => {
    const countApi = async () => {
      try {
        const countValue = await fetch(
          `/api/apilimit/checkapilimit/${session?.user?.email}`
        );
        const countNum = await countValue.json();
        setcount(countNum.count);
        console.log("countNumber inside appsidebar:", countNum);
        // return await countNum
      } catch (error) {}
    };
    if (status === "authenticated" && session) {
      countApi();
    }
  }, []);

  return (
    <>
      <SidebarProvider>
        <AppSidebar count={count} />

        <main className="w-screen">
          <Navbar_2 />

          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
