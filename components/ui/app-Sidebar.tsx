import React, { useEffect, useState } from "react";
import Image from "next/image";
import FoodVitals_AI_Logo from "./../../public/FoodVitals_AI_Logo.jpg";
import fv_ai from "./../../public/fv-ai-logo.png";
import {
  ScanBarcode,
  HeartPulse,
  History,
  CircleFadingArrowUp,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useStore } from "@/zustand/zustandStore";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Scan & Summarize",
    url: "scan",
    icon: ScanBarcode,
    color: "green",
  },
  {
    title: "Health Profile",
    url: "healthprofile",
    icon: HeartPulse,
    color: "red",
  },
  {
    title: "Scan History",
    url: "scanhistory",
    icon: History,
    color: "blue",
  },
  {
    title: "Upgrade",
    url: "upgrade",
    icon: CircleFadingArrowUp,
    color: "teal",
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
    color: "#505050",
  },
];

export function AppSidebar({ count }: any) {
  //console.log("count inside appsidebar:", count);
  const router = useRouter();
  const storeVal = useStore((state: any) => state.count);
  const proVal = useStore((state: any) => state.isInProModel);
  //console.log("coutn value from zustand:", storeVal, proVal);

  return (
    <>
      <div className="bg-white">
        <Sidebar className="bg-white">
          <SidebarHeader className="bg-white ">
            <div className="flex  items-center gap-1.5">
              <Image
                className="rounded-md "
                src={fv_ai}
                width={75}
                height={75}
                alt="missing img"
                // style={{ width: "auto", height: "auto" }}
              />
              <span className="text-xl font-bold text-gray-800 ">
                FoodVitals-AI
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-white">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="hover:bg-gray-300 ">
                        <a href={item.url} className="py-3">
                          <item.icon
                            // size={32}
                            style={{ width: "30px", height: "30px" }}
                            color={`${item.color}`}
                            strokeWidth={2.5}
                          />
                          <span className="text-md text-gray-900">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className=" bg-white ">
            <div className="bg-gray-300 rounded-md mx-1 my-1   px-10 py-3 ">
              <div className="flex flex-col justify-center items-center  gap-1">
                {proVal ? (
                  <p className="text-xl font-bold bg-gradient-to-r from-teal-500 via-pink-500 to-lime-400 text-transparent bg-clip-text">
                    You are in pro model
                  </p>
                ) : (
                  <div>
                    <div className="text-lg text-center text-black mb-0.5 font-bold">
                      {storeVal}/5
                    </div>

                    <button
                      onClick={() => {
                        router.push("/upgrade");
                      }}
                      type="button"
                      className="text-gray-900 bg-gradient-to-r from-teal-300 to-lime-400 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-bold rounded-lg text-md px-5  py-1 text-center me-2 "
                    >
                      Upgrade
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>
    </>
  );
}
