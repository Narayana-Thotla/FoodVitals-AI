"use client";
import React, { use, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/zustand/zustandStore";
import { apiLimitCount } from "@/utils/apiLimitCount";
import Circle_Loader from "@/components/ui/circle_loader_ui";

const Page = () => {
  const [loading, setloading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [email, setemail] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const storeVal = useStore((state: any) => state.count);
  const updateCount = useStore((state: any) => state.updateCount);
  const updateModel = useStore((state: any) => state.updateModel);

  useEffect(() => {
    if (status == "loading") {
      return;
    }
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status == "authenticated") {
      setemail(session?.user?.email || "");
      const proFunction = async () => {
        const result = await apiLimitCount(session);
        updateCount(result.count);
        if (result.status == 202) {
          updateModel(true);
        } else {
          updateModel(false);
        }
      };

      proFunction();
    }
  }, [status, session, updateCount, updateModel, router]);

  const onSubscribe = async () => {
    try {
      setSubscribeLoading(true);
      // console.log("email in upgrade-pricing card-2:", email);
      const res = await fetch(`/api/stripe/${email}`);
      const data = await res.json();
      // console.log(res, data);
      const stripeUrl = await JSON.parse(data.url);
      // console.log(stripeUrl);
      window.location.href = stripeUrl;
      // console.log(window.location.href);
    } catch (error: any) {
      console.log("errror in upgradepage_2:", error.message);
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <div className="p-5 ">
      <div className=" flex  items-center gap-1">
        <Settings size={50} />
        <h2 className="text-2xl font-bold">Settings </h2>
      </div>
      <div className="my-3">
        <button
          onClick={onSubscribe}
          type="button"
          className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-bold rounded-lg text-sm px-8 py-2.5 text-center me-2 mb-2 "
        >
          {subscribeLoading ? (
            <Circle_Loader className="w-4 h-4 mx-16 my-1" />
          ) : (
            "Manage Subscriptions"
          )}
        </button>

        <button
          onClick={() => {
            setloading(true);
            signOut();
            setloading(false);
          }}
          type="button"
          className="text-white block bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-20 py-2.5 text-center me-2 mb-2"
        >
          {loading ? (
            <Circle_Loader className="w-4 h-4 mx-4 my-0.5" />
          ) : (
            "SignOut"
          )}{" "}
        </button>
      </div>
    </div>
  );
};

export default Page;
