"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import fv from "@/public/default_image.png";
import { EllipsisVertical } from "lucide-react";

import { FolderHeart } from "lucide-react";
import { useStore } from "@/zustand/zustandStore";
import { apiLimitCount } from "@/utils/apiLimitCount";

type Checked = DropdownMenuCheckboxItemProps["checked"];
interface prod_info {
  id?: number;
  product_name?: String;
  product_image_url?: String;
  product_ingredients?: String;
  product_summary?: String;
}

const Page = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productsInfo, setproductsInfo] = useState<prod_info[]>([{}]);
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(false);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);

  const router = useRouter();
  const { data: session, status } = useSession();
  const storeVal = useStore((state: any) => state.count);
  const updateCount = useStore((state: any) => state.updateCount);
  const updateModel = useStore((state: any) => state.updateModel);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    async function fetchProducts() {
      try {
        const result = await apiLimitCount(session);
        updateCount(result.count);
        if (result.status == 202) {
          updateModel(true);
        } else {
          updateModel(false);
        }
        const response = await fetch(
          `/api/productscanned/${session?.user?.email}`
        );
        const data = await response.json();
        const productJson = await JSON.parse(data.productsInfo);
        setproductsInfo(productJson);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
      }
    }
    if (status === "authenticated") {
      fetchProducts();
    }
  }, [status, session, updateCount, updateModel, router]);

  const handleScanListApi = async (item: any) => {
    try {
      console.log("item val in handlescanlistapi:", item);
      const res = await fetch(`/api/userlist/${item.user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scanListItem: item }),
      });

      if (res.ok) {
        // alert("handlescanlistAPI sending req to backend successfully!");
        console.log(
          "response in handlescanlistAPI sending req to backend:",
          res
        );
      } else {
        const errorData = await res.json();
        // alert(`Error: ${errorData.message}`);
      }
      console.log("item in handlescanlistapi::!!", item.product_name);
    } catch (error: any) {
      console.log("error in scanhistory page:", error.message);
    }
  };

  return (
    <div className="m-1 ">
      <div className="bg-slate-600 rounded-md p-1 my-1">
        <div className="my-1 w-full flex justify-between items-center">
          <h4 className="text-xl font-bold  text-white">Scan History</h4>
          <div
            className="mx-2 cursor-pointer"
            onClick={() => {
              router.push("/userlist");
            }}
          >
            <FolderHeart color="#5ef953" />
          </div>
        </div>

        <div className="bg-white border-green-600 ">
          <div className="flex m-2 p-2 bg-white flex-wrap w-[72vw] justify-between  ">
            {productsInfo.map((item, index) => {
              return (
                <div
                  key={index}
                  className="h-full flex items-center w-full border-gray-200 border p-4 rounded-sm bg-slate-400 shadow-xl"
                >
                  <Image
                    className="mr-7"
                    src={(item.product_image_url as string) || fv}
                    width={150}
                    height={150}
                    alt="Picture of the author"
                  />
                  <div className="flex-grow">
                    <h2 className="text-gray-900 title-font font-medium">
                      {item.product_name}
                    </h2>
                    <p className="text-gray-500">&nbsp;</p>
                  </div>

                  {/* <!-- Dropdown menu --> */}
                  <div className="bg-slate-400">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-slate-400 border-none shadow-none"
                        >
                          <EllipsisVertical color="black" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={showStatusBar}
                          onCheckedChange={(checked) => {
                            setShowStatusBar(checked);
                            if (checked == true) {
                              handleScanListApi(item);
                            }
                          }}
                        >
                          Add to list
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={showActivityBar}
                          onCheckedChange={setShowActivityBar}
                        >
                          Select item
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
