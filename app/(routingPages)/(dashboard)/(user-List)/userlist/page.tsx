"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import fv from "@/public/default_image.png";

import { FolderHeart } from "lucide-react";
import { useSession } from "next-auth/react";
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

const handleDeleteListItem = async (item: any, setproductsInfo: any) => {
  try {
    const res = await fetch(
      `/api/userlist/deletelistitem/${item.product_code}/${item.user_id}`
    );
    const data = await res.json();
    const productInfoUpdated = await JSON.parse(data.updatedList);
    console.log(
      "res fdrom the server deletelistiem:",
      typeof productInfoUpdated
    );
    setproductsInfo(productInfoUpdated);
  } catch (error: any) {
    console.log("error in handleDeleteListItem:", error.message);
  }
};

const page = () => {
  const router = useRouter();
  const [productsInfo, setproductsInfo] = useState<prod_info[]>([{}]);
  const storeVal = useStore((state: any) => state.count);
  const updateCount = useStore((state: any) => state.updateCount);
  const updateModel = useStore((state: any) => state.updateModel);

  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/");
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const result = await apiLimitCount(session);
        updateCount(result.count);
        if (result.status == 202) {
          updateModel(true);
        } else {
          updateModel(false);
        }
        console.log("userid of user in userlist:");
        const response = await fetch(`/api/userlist/${session?.user?.email}`); // Call the API route
        const data = await response.json();
        const productJson = await JSON.parse(data.userListInfo);
        console.log(typeof data);
        setproductsInfo(productJson); // Set the data to state
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // setLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchProducts();
    }
  }, [session, handleDeleteListItem]);

  return (
    <div className="m-1 ">
      <div className="bg-slate-600 rounded-md p-1 my-1">
        <div className="my-1 w-full flex justify-between items-center">
          <h4 className="text-xl font-bold  text-white">Wishlist</h4>
        </div>

        <div className="bg-white border-green-600 ">
          <div className="flex m-2 p-2 bg-white flex-wrap w-[72vw] justify-between  ">
            {productsInfo.map((item: any, index: any) => {
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

                  <Trash2
                    onClick={() => {
                      handleDeleteListItem(item, setproductsInfo);
                    }}
                    className="cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
